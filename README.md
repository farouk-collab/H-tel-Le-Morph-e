# Hotel Le Morphee

Application web pour l'hotel **Le Morphee** avec :

- un front React + Vite
- une API Express
- une base SQLite locale
- un espace admin
- un mode de paiement mock ou PayGate

## Stack

- React 18
- Vite 5
- Express 5
- SQLite locale via `node:sqlite`
- Tailwind CSS

## Prerequis

- Node.js recent compatible avec `node:sqlite`
- Recommande : **Node.js 22+**
- npm

## Installation

Depuis la racine du projet :

```powershell
npm install
Copy-Item .env.example .env
```

## Lancement

### Demarrage complet

Cette commande lance :

- l'API sur `http://localhost:4000`
- le front Vite sur `http://localhost:5173`

```powershell
npm run dev
```

### Lancer les services separement

Backend :

```powershell
npm run server
```

Frontend :

```powershell
npm run dev:client
```

Backend en mode watch :

```powershell
npm run dev:server
```

## Base de donnees

Le projet n'a pas besoin de MySQL, PostgreSQL ou XAMPP pour la base.

La base est une SQLite locale stockee dans :

`server/data/hotel.db`

Au demarrage du backend :

- la base est creee automatiquement si elle n'existe pas
- les tables sont initialisees automatiquement
- des donnees par defaut sont injectees
- un compte admin est cree automatiquement

Un ancien export JSON est aussi conserve dans :

`server/data/db.json`

## Variables d'environnement

```env
PORT=4000
APP_URL=http://localhost:5173
JWT_SECRET=change-me-in-production
PAYMENT_MODE=mock
PAYGATE_API_BASE=https://paygateglobal.com/api/v1
PAYGATE_PAYMENT_PAGE=https://paygateglobal.com/v1/page
PAYGATE_IDENTIFIER=
PAYGATE_API_KEY=
PAYGATE_CALLBACK_URL=http://localhost:4000/api/payments/callback/paygate
PAYGATE_RETURN_URL=http://localhost:5173/mon-compte
```

Option supplementaire utile :

- `DEFAULT_ADMIN_PASSWORD` pour changer le mot de passe admin par defaut au premier seed

## Acces admin par defaut

- Email : `hotellemorphee8@gmail.com`
- Mot de passe : `admin123`

URL admin :

`http://localhost:5173/admin`

## Routes principales

Front :

- `/`
- `/admin`
- `/mon-compte`
- `/rooms/:slug`
- `/spaces/:slug`
- `/confidentialite`
- `/mentions-legales`

API :

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/rooms`
- `GET /api/spaces`
- `POST /api/reservations`
- `POST /api/reservations/rooms`
- `POST /api/reservations/spaces`
- `GET /api/me/reservations`
- `GET /api/me/payments`
- `GET /api/admin/reservations`
- `GET /api/admin/payments`

## Paiement

### Mode mock

```env
PAYMENT_MODE=mock
```

Dans ce mode, les paiements sont simules localement.

### Mode PayGate

```env
PAYMENT_MODE=live
PAYGATE_IDENTIFIER=...
PAYGATE_API_KEY=...
PAYGATE_CALLBACK_URL=...
PAYGATE_RETURN_URL=...
```

Le callback backend est expose sur :

`POST /api/payments/callback/paygate`

## Build

```powershell
npm run build
```

Previsualiser le build :

```powershell
npm run preview
```

## Structure rapide

```text
src/              Frontend React
server/           API Express
server/data/      Base SQLite et donnees locales
scripts/dev.mjs   Lancement simultane front + back
public/           Assets statiques
```

## Depannage rapide

### Le projet ne demarre pas

- verifier que Node.js est assez recent
- verifier que `npm install` a bien ete execute
- verifier que `.env` existe a la racine

### La base ne se cree pas

- lancer `npm run server`
- verifier que le dossier `server/data/` est accessible en ecriture

### Le front ne parle pas a l'API

- verifier que le backend tourne sur `http://localhost:4000`
- verifier que le front tourne sur `http://localhost:5173`
- verifier que `APP_URL` dans `.env` vaut bien `http://localhost:5173`
