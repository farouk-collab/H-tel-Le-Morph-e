# Hotel Le Morphee

Application web pour l'hotel **Le Morphee** avec :

- un front React + Vite
- une API Express
- une base MySQL/MariaDB
- un espace admin
- un mode de paiement mock ou PayGate

## Stack

- React 18
- Vite 5
- Express 5
- MySQL / MariaDB via `mysql2`
- Tailwind CSS

## Prerequis

- Node.js 20+
- npm
- MySQL ou MariaDB lance localement
- En environnement XAMPP : demarrer **Apache** et surtout **MySQL**

## Installation

Depuis la racine du projet :

```powershell
npm install
Copy-Item .env.example .env
```

## Base de donnees

Le backend utilise maintenant une **vraie base MySQL/MariaDB**.

Par defaut, la configuration locale attend :

- host : `127.0.0.1`
- port : `3306`
- user : `root`
- password : vide
- database : `hotel_le_morphee`

Au demarrage du backend :

- la base `hotel_le_morphee` est creee automatiquement si elle n'existe pas
- les tables sont initialisees automatiquement
- les donnees par defaut sont seedees automatiquement
- un compte admin est cree automatiquement

## Variables d'environnement

```env
PORT=4000
APP_URL=http://localhost:5173
JWT_SECRET=change-me-in-production
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=hotel_le_morphee
DB_CONNECTION_LIMIT=10
DEFAULT_ADMIN_PASSWORD=admin123
PAYMENT_MODE=mock
PAYGATE_API_BASE=https://paygateglobal.com/api/v1
PAYGATE_PAYMENT_PAGE=https://paygateglobal.com/v1/page
PAYGATE_IDENTIFIER=
PAYGATE_API_KEY=
PAYGATE_CALLBACK_URL=http://localhost:4000/api/payments/callback/paygate
PAYGATE_RETURN_URL=http://localhost:5173/mon-compte
```

## Lancement

### Demarrage complet

```powershell
npm run dev
```

Cette commande lance :

- l'API sur `http://localhost:4000`
- le front Vite sur `http://localhost:5173`

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
server/lib/       Acces MySQL/MariaDB
server/data/      Export legacy local
scripts/dev.mjs   Lancement simultane front + back
public/           Assets statiques
```

## Depannage rapide

### L'API ne demarre pas

- verifier que MySQL/MariaDB tourne
- verifier les variables `DB_*` dans `.env`
- verifier que l'utilisateur MySQL a le droit de creer la base

### Erreur de connexion MySQL

- verifier `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`
- si XAMPP est utilise, verifier que le module **MySQL** est bien demarre

### Version de Node

Le projet doit tourner avec une version recente de Node. La machine actuelle renvoie **Node v16.20.2**, qui est trop ancienne pour certaines dependances du projet.
