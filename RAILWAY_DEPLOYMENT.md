# Railway Deployment Guide

## Napomena o Manus Hosting-u

**Manus nudi ugrađeni hosting sa podrškom za custom domene.** Možete direktno deployovati aplikaciju kroz Manus UI klikom na **Publish** dugme (nakon što je checkpoint kreiran).

Ako želite nastaviti sa Railway deploymentom, imajte na umu da mogu postojati problemi sa kompatibilnošću.

---

## Deployment na Railway

### Preduvjeti

1. Railway nalog (registrujte se na [railway.app](https://railway.app))
2. GitHub nalog
3. Git instaliran lokalno

### Korak 1: Kreiranje GitHub Repository-ja

```bash
# Inicijalizujte git (ako već nije)
cd /home/ubuntu/robots_validator
git init

# Dodajte remote repository
git remote add origin https://github.com/YOUR_USERNAME/robots-validator.git

# Commitujte sve fajlove
git add .
git commit -m "Initial commit: Robots.txt Validator"

# Push na GitHub
git push -u origin main
```

### Korak 2: Kreiranje Railway Projekta

1. Idite na [railway.app](https://railway.app)
2. Kliknite **"New Project"**
3. Odaberite **"Deploy from GitHub repo"**
4. Odaberite vaš `robots-validator` repository
5. Railway će automatski detektovati Node.js projekat

### Korak 3: Konfiguracija Environment Variables

U Railway Dashboard, dodajte sljedeće environment varijable:

**Obavezne varijable:**
```
NODE_ENV=production
PORT=3000
```

**Database varijable (ako koristite MySQL/TiDB):**
```
DATABASE_URL=mysql://user:password@host:port/database
```

**OAuth varijable (ako koristite Manus OAuth):**
```
JWT_SECRET=your-jwt-secret
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
VITE_APP_ID=your-app-id
OWNER_OPEN_ID=your-owner-openid
OWNER_NAME=your-name
```

**Forge API varijable (za LLM i storage):**
```
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your-forge-api-key
VITE_FRONTEND_FORGE_API_KEY=your-frontend-forge-key
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im
```

### Korak 4: Build i Start Komande

Railway će automatski detektovati `package.json` skripte:

- **Build Command:** `pnpm build`
- **Start Command:** `pnpm start`

Ako trebate ručno konfigurirati:

1. Idite u **Settings** tab
2. Postavite **Build Command:** `pnpm install && pnpm build`
3. Postavite **Start Command:** `pnpm start`

### Korak 5: Domain Setup

1. U Railway Dashboard, idite na **Settings** → **Domains**
2. Kliknite **"Generate Domain"** za besplatan Railway subdomain
3. Ili dodajte **Custom Domain** ako imate svoj domen

### Korak 6: Database Setup (Opciono)

Ako trebate MySQL database:

1. Kliknite **"New"** → **"Database"** → **"Add MySQL"**
2. Railway će automatski kreirati `DATABASE_URL` varijablu
3. Pokrenite migracije:
   ```bash
   railway run pnpm db:push
   ```

### Korak 7: Deployment

1. Railway će automatski deployovati nakon svakog push-a na GitHub
2. Pratite deployment logs u Railway Dashboard
3. Kada je deployment završen, kliknite na generated URL da vidite aplikaciju

### Troubleshooting

**Problem: Build fails**
- Provjerite da li su sve dependencies instalirane
- Provjerite `package.json` scripts
- Provjerite Railway logs za specifične greške

**Problem: App crashes nakon deploya**
- Provjerite environment varijable
- Provjerite da li `PORT` varijabla postoji
- Provjerite Railway logs za runtime greške

**Problem: Database connection fails**
- Provjerite `DATABASE_URL` format
- Provjerite da li je database servis pokrenut
- Provjerite firewall pravila

### Continuous Deployment

Railway automatski deployuje svaki put kada pushujete na GitHub:

```bash
# Napravite izmjene
git add .
git commit -m "Update feature"
git push

# Railway će automatski deployovati
```

### Monitoring

- **Logs:** Railway Dashboard → **Deployments** → **View Logs**
- **Metrics:** Railway Dashboard → **Metrics** tab
- **Health Check:** Provjerite `/` endpoint

---

## Alternativa: Manus Hosting

Umjesto Railway-a, možete koristiti Manus ugrađeni hosting:

1. Otvorite Manus UI
2. Kliknite **Publish** dugme (u gornjem desnom uglu)
3. Vaša aplikacija će biti dostupna na `*.manus.space` domenu
4. Možete dodati custom domen kroz **Settings** → **Domains**

**Prednosti Manus hostinga:**
- Nema potrebe za ručnom konfiguracijom
- Automatski SSL certifikati
- Ugrađena podrška za custom domene
- Nema problema sa kompatibilnošću
