# Railway Deployment Guide

Ovo uputstvo objašnjava kako deployovati robots.txt validator na Railway sa custom domenom **robots.funky.enterprises**.

## Napomena o Manus Hosting-u

**Manus nudi ugrađeni hosting sa podrškom za custom domene.** Možete direktno deployovati aplikaciju kroz Manus UI klikom na **Publish** dugme. Ako želite nastaviti sa Railway deploymentom, imajte na umu da mogu postojati problemi sa kompatibilnošću.

---

## Preduvjeti

- GitHub repozitorijum sa projektom (vidi `GITHUB_SETUP.md`)
- Railway nalog ([railway.app](https://railway.app))
- Pristup DNS postavkama za `funky.enterprises` domen
- MySQL/TiDB database (Railway nudi besplatnu MySQL instancu)

## Korak 1: Kreiranje Railway Projekta

1. Idi na [Railway](https://railway.app) i prijavi se
2. Klikni **"New Project"**
3. Odaberi **"Deploy from GitHub repo"**
4. Autorizuj Railway da pristupi GitHub nalogu
5. Odaberi `robots-txt-validator` repozitorijum
6. Railway će automatski detektovati Node.js projekat

## Korak 2: Dodavanje MySQL Database

1. U Railway projektu, klikni **"New"** → **"Database"** → **"Add MySQL"**
2. Railway će automatski kreirati MySQL instancu
3. Kopiraj `DATABASE_URL` connection string iz MySQL servisa
4. Format: `mysql://user:password@host:port/database`

## Korak 3: Konfiguracija Environment Variables

U Railway projektu, idi na **Variables** tab i dodaj sljedeće:

### Obavezne Varijable

```bash
# Database
DATABASE_URL=mysql://user:password@host:port/database

# JWT Secret (generiši random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Node Environment
NODE_ENV=production
PORT=3000
```

### OAuth Varijable (ako koristiš Manus OAuth)

```bash
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
VITE_APP_ID=your-app-id
OWNER_OPEN_ID=your-owner-openid
OWNER_NAME=your-name
```

### Forge API Varijable (za LLM i storage)

```bash
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your-forge-api-key
VITE_FRONTEND_FORGE_API_KEY=your-frontend-forge-key
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im
```

### Generisanje JWT Secret

```bash
# Koristi OpenSSL za generisanje random stringa
openssl rand -base64 32
```

## Korak 4: Build i Start Komande

Railway automatski detektuje komande iz `package.json`:

### Build Command
```bash
pnpm install && pnpm build
```

### Start Command
```bash
pnpm start
```

Ako trebate ručno konfigurirati, idi na **Settings** → **Build & Deploy**.

## Korak 5: Deploy

1. Klikni **"Deploy"** u Railway dashboard-u
2. Prati build logs u **"Deployments"** tab-u
3. Nakon uspješnog build-a, aplikacija će biti dostupna na Railway URL-u (npr. `your-app.railway.app`)

## Korak 6: Postavljanje Custom Domena (robots.funky.enterprises)

### 6.1 Dodavanje Domena u Railway

1. U Railway projektu, idi na **Settings** → **Domains**
2. Klikni **"Custom Domain"**
3. Unesi: `robots.funky.enterprises`
4. Railway će dati **CNAME target** (npr. `your-app.up.railway.app`)

### 6.2 Konfiguracija DNS Zapisa

Idi na DNS provider gdje je `funky.enterprises` registrovan (npr. Cloudflare, GoDaddy, Namecheap) i dodaj sljedeći zapis:

**CNAME Zapis:**
```
Type: CNAME
Name: robots
Value: your-app.up.railway.app
TTL: Auto ili 3600
```

**Primjer za Cloudflare:**
- **Type**: CNAME
- **Name**: robots
- **Target**: your-app.up.railway.app (Railway će dati tačan target)
- **Proxy status**: DNS only (siva oblak ikona) ⚠️ **Važno**: Isključi Cloudflare proxy
- **TTL**: Auto

**Primjer za GoDaddy:**
- **Type**: CNAME
- **Host**: robots
- **Points to**: your-app.up.railway.app
- **TTL**: 1 Hour

**Primjer za Namecheap:**
- **Type**: CNAME Record
- **Host**: robots
- **Value**: your-app.up.railway.app
- **TTL**: Automatic

### 6.3 Verifikacija DNS Zapisa

Provjeri DNS propagaciju:

```bash
# Linux/Mac
dig robots.funky.enterprises

# Windows
nslookup robots.funky.enterprises

# Online tool
# Idi na https://dnschecker.org i unesi robots.funky.enterprises
```

### 6.4 Aktivacija u Railway

1. Vrati se u Railway Dashboard → **Settings** → **Domains**
2. Klikni **"Verify"** pored `robots.funky.enterprises`
3. Railway će automatski generisati SSL certifikat (Let's Encrypt)
4. Sačekaj 5-10 minuta za SSL certifikat

### 6.5 Finalna Provjera

1. Otvori `https://robots.funky.enterprises` u browseru
2. Trebao bi vidjeti robots.txt validator aplikaciju
3. Provjeri da li je SSL aktivan (zelena lokot ikona u browseru)

## Korak 7: Database Migracije

Nakon prvog deploya, pokreni database migracije:

### Opcija 1: Railway CLI (preporučeno)

```bash
# Instaliraj Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link projekat
railway link

# Pokreni migracije
railway run pnpm db:push
```

### Opcija 2: Ručno preko Railway Shell

1. U Railway projektu, idi na **Service** → **Shell**
2. Pokreni:
```bash
pnpm db:push
```

## Korak 8: Monitoring i Logs

### Praćenje Logova

1. Idi na **Deployments** tab
2. Klikni na aktivan deployment
3. Vidi real-time logs

### Metrics

Railway automatski prati:
- CPU usage
- Memory usage
- Network traffic
- Response times

## Korak 9: Automatski Redeploy

Railway automatski redeployuje aplikaciju kada pushneš nove commitove na GitHub:

```bash
# Napravi izmjene
git add .
git commit -m "Update feature"
git push origin main

# Railway će automatski detektovati push i redeployovati
```

## Troubleshooting

### Problem: Build Failed

**Rješenje**: Provjeri build logs u Railway dashboard-u. Najčešći problemi:
- Missing environment variables
- Node.js version mismatch
- Dependency installation errors

**Fix**: Dodaj Node.js verziju u `package.json`:
```json
"engines": {
  "node": "22.x",
  "pnpm": "10.x"
}
```

### Problem: Database Connection Error

**Rješenje**: Provjeri `DATABASE_URL` format:

```bash
# Pravilan format
mysql://user:password@host:port/database

# NE koristi localhost
# Koristi Railway MySQL host (npr. mysql.railway.internal)
```

### Problem: Custom Domain Ne Radi

**Rješenje**:
1. Provjeri DNS zapise:
```bash
dig robots.funky.enterprises
# Trebao bi vidjeti CNAME koji pokazuje na Railway target
```
2. Provjeri da li je Cloudflare proxy isključen (siva oblak ikona)
3. Sačekaj do 24h za punu DNS propagaciju
4. Provjeri da li je SSL certifikat aktivan u Railway

### Problem: 502 Bad Gateway

**Rješenje**:
- Provjeri da li aplikacija sluša na pravom portu:
```javascript
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```
- Provjeri logs za runtime errors
- Provjeri da li su sve environment varijable postavljene

### Problem: SSL Certificate Error

**Rješenje**:
- Sačekaj 10-15 minuta nakon što si dodao custom domen
- Railway automatski generiše Let's Encrypt certifikat
- Provjeri da li DNS zapis pokazuje na Railway target
- Ako problem persisti, ukloni domen i dodaj ga ponovo

## Korak 10: SSL/HTTPS

Railway automatski generiše SSL certifikat za custom domene:
- **Let's Encrypt** certifikat
- **Automatsko obnavljanje** svakih 90 dana
- **HTTPS redirect** automatski aktivan
- **HTTP/2** podrška

## Korak 11: Skaliranje (Opciono)

Railway nudi različite planove:

- **Hobby Plan**: $5/mjesec
  - 512MB RAM
  - 1GB storage
  - 100GB bandwidth

- **Pro Plan**: $20/mjesec
  - 8GB RAM
  - 100GB storage
  - 1TB bandwidth

Za skaliranje:
1. Idi na **Settings** → **Plan**
2. Odaberi odgovarajući plan

## Dodatni Resursi

- [Railway Documentation](https://docs.railway.app)
- [Railway CLI](https://docs.railway.app/develop/cli)
- [Custom Domains Guide](https://docs.railway.app/deploy/exposing-your-app#custom-domains)
- [Environment Variables](https://docs.railway.app/develop/variables)
- [DNS Checker Tool](https://dnschecker.org)

## Alternativa: Manus Built-in Hosting

**Napomena**: Manus nudi ugrađeni hosting sa custom domain podrškom. Prednosti:

1. **Jednostavnije postavljanje** - samo klikni Publish dugme
2. **Automatski SSL** - bez dodatne konfiguracije
3. **Custom domeni** - dodaj direktno u Settings → Domains
4. **Integrisani database** - nema potrebe za eksternim servisima
5. **Nema problema sa kompatibilnošću**

Za Manus hosting:
1. Klikni **Publish** dugme u Manus UI-ju
2. Aplikacija će biti dostupna na `*.manus.space`
3. Dodaj custom domen u **Settings** → **Domains**
