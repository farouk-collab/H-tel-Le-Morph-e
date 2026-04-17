# Backend local Hotel Le Morphee

## Stockage

- Base locale SQLite : `server/data/hotel.db`
- Ancien export JSON conservé : `server/data/db.json`

## Demarrage

1. Copier `.env.example` vers `.env`
2. Lancer l'API avec `npm run server`
3. Lancer le front avec `npm run dev`

## Comptes initiaux

- Admin: `hotellemorphee8@gmail.com`
- Mot de passe par defaut: `admin123`

## Endpoints principaux

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/rooms`
- `POST /api/admin/rooms`
- `PUT /api/admin/rooms/:id`
- `DELETE /api/admin/rooms/:id`
- `POST /api/reservations`
- `GET /api/me/reservations`
- `GET /api/me/payments`
- `GET /api/admin/reservations`
- `GET /api/admin/payments`
- `POST /api/payments/paygate/initiate`
- `POST /api/payments/callback/paygate`

## Paiement

- `PAYMENT_MODE=mock` simule un paiement reussi et cree un historique local
- Le mode live attend les vraies cles PayGate dans `.env`
- Quand tu m'enverras les identifiants PayGate, je brancherai la requete marchande exacte

## Note technique

- Cette version utilise SQLite localement dans le projet pour une installation simple sans service externe.
- Le backend conserve les memes endpoints que le front actuel pour limiter les regressions.
