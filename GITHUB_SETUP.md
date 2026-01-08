# GitHub Setup Guide

Ovo uputstvo objašnjava kako postaviti robots.txt validator projekat na GitHub.

## Preduvjeti

- GitHub nalog
- Git instaliran na računaru
- Pristup projektu na lokalnom računaru

## Korak 1: Kreiranje GitHub Repozitorijuma

1. Idi na [GitHub](https://github.com) i prijavi se
2. Klikni na **"+"** u gornjem desnom uglu
3. Odaberi **"New repository"**
4. Popuni detalje:
   - **Repository name**: `robots-txt-validator`
   - **Description**: `robots.txt validator with meta robots and X-Robots-Tag support`
   - **Visibility**: Odaberi **Public** ili **Private**
   - **NE čekiraj** "Initialize this repository with a README"
5. Klikni **"Create repository"**

## Korak 2: Inicijalizacija Git Repozitorijuma

Otvori terminal u root direktorijumu projekta (`/home/ubuntu/robots_validator`) i izvršite sljedeće komande:

```bash
# Inicijalizuj git repozitorijum (ako već nije)
git init

# Dodaj sve fajlove
git add .

# Kreiraj prvi commit
git commit -m "Initial commit: robots.txt validator with Funky Enterprises design"

# Dodaj remote origin (zamijeni YOUR_USERNAME sa tvojim GitHub username-om)
git remote add origin https://github.com/YOUR_USERNAME/robots-txt-validator.git

# Pushuj kod na GitHub
git branch -M main
git push -u origin main
```

## Korak 3: Verifikacija

1. Osvježi GitHub repozitorijum stranicu
2. Trebao bi vidjeti sve fajlove projekta
3. Provjeri da li su svi fajlovi prisutni:
   - `client/` - frontend kod
   - `server/` - backend kod
   - `drizzle/` - database schema
   - `package.json`
   - `README.md`

## Korak 4: Dodavanje .gitignore (ako ne postoji)

Ako `.gitignore` fajl ne postoji, kreiraj ga sa sljedećim sadržajem:

```
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
build/

# Environment files
.env
.env.local
.env.production

# Database
*.db
*.sqlite

# Logs
*.log

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
```

## Korak 5: GitHub Secrets (za CI/CD)

Ako planiraš koristiti GitHub Actions za automatski deployment:

1. Idi na **Settings** → **Secrets and variables** → **Actions**
2. Klikni **"New repository secret"**
3. Dodaj potrebne secrets:
   - `DATABASE_URL` - MySQL/TiDB connection string
   - `JWT_SECRET` - Secret za JWT tokene
   - Ostale environment varijable iz projekta

## Sljedeći Koraci

Nakon što je projekat na GitHub-u, možeš:

1. **Deployovati na Railway** - vidi `RAILWAY_DEPLOYMENT.md`
2. **Postaviti CI/CD** - automatski deployment sa GitHub Actions
3. **Kolaboracija** - dodaj druge developere kao collaborators

## Troubleshooting

### Problem: "Permission denied (publickey)"

**Rješenje**: Postavi SSH ključ ili koristi HTTPS sa Personal Access Token:

```bash
# Koristi HTTPS sa Personal Access Token
git remote set-url origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/robots-txt-validator.git
```

### Problem: "Repository not found"

**Rješenje**: Provjeri da li si pravilno unio username i repository name:

```bash
git remote -v  # Provjeri trenutni remote URL
git remote set-url origin https://github.com/YOUR_USERNAME/robots-txt-validator.git
```

## Dodatni Resursi

- [GitHub Documentation](https://docs.github.com)
- [Git Basics](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)
- [GitHub Desktop](https://desktop.github.com/) - GUI alternativa za Git
