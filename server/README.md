# Backend local Hotel Le Morphee

## Stockage

- Base MySQL / MariaDB : `hotel_le_morphee`
- Ancien export JSON conserve : `server/data/db.json`

## Demarrage

1. Copier `.env.example` vers `.env`
2. Demarrer MySQL / MariaDB
3. Lancer l'API avec `npm run server`
4. Lancer le front avec `npm run dev`

## Variables base de donnees

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

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
- `PAYMENT_MODE=live` ouvre la page de paiement hebergee PayGate via `https://paygateglobal.com/v1/page`
- Variables attendues : `PAYGATE_IDENTIFIER`, `PAYGATE_API_KEY`, `PAYGATE_RETURN_URL`, `PAYGATE_CALLBACK_URL`
- `PAYGATE_PAYMENT_PAGE` permet de surcharger l'url de la page de paiement si PayGate vous fournit un endpoint specifique
- Le callback serveur reste disponible sur `POST /api/payments/callback/paygate`

## Note technique

- Cette version utilise MySQL/MariaDB localement pour un stockage persistant plus proche de la production.
- Le backend conserve les memes endpoints que le front actuel pour limiter les regressions.
