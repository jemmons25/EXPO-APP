# CardDrop

Digital business cards that live in your phone&apos;s wallet. Design a beautiful card, share it with a QR code, and add it to **Apple Wallet** or **Google Wallet** so it&apos;s two clicks away.

## Features

- **Card editor** with live preview — 6 styles (Minimal, Bold, Glassmorphism, Dark, Gradient, Corporate), 12 fonts, 3 layouts, custom colors, gradients, background images, icon sets, and font scaling
- **Flip animation** — front shows your identity, back shows your QR code
- **QR codes** — custom color, background, error-correction level (L/M/Q/H), corner styles (square/rounded/dots), and optional center logo; downloadable as PNG or SVG
- **Apple Wallet** — signed `.pkpass` generation via `passkit-generator`
- **Google Wallet** — JWT-signed Save-to-Wallet links for generic passes
- **Public profile** at `/u/[slug]` with Save Contact (`.vcf`), tappable social links, and full-screen QR mode
- **Analytics** — views, QR scans, wallet adds, vCard downloads, and link clicks (IPs hashed for privacy)
- **Auth** — passwordless magic links (+ optional Google OAuth), no passwords stored
- **Mobile-first** — 44px tap targets, bottom share sheet, swipe-to-dismiss QR view, works great at 375px

## Quick start

```bash
npm install
cp .env.example .env        # defaults work for local dev
npx prisma db push          # creates the SQLite dev database
npm run dev
```

Open http://localhost:3000. Sign in with any email — when SMTP isn&apos;t configured, the magic link is logged to the server console **and** shown as an "Open magic link (dev)" button.

## Tech stack

| Layer     | Choice                                                        |
| --------- | ------------------------------------------------------------- |
| Frontend  | Next.js 14 (App Router), TailwindCSS, Framer Motion            |
| Backend   | Next.js API routes, Prisma ORM                                 |
| Database  | SQLite (dev) / PostgreSQL (production — flip the provider)     |
| Wallet    | `passkit-generator` (Apple), `jsonwebtoken` RS256 (Google)     |
| Images    | `sharp` (resizing, QR PNG rasterization)                       |
| QR        | Custom SVG renderer on top of `qrcode` (styles, logos)         |
| Auth      | Magic links via JWT sessions (`jose`) + optional Google OAuth  |

## API

```
POST   /api/cards                    Create a card
GET    /api/cards                    List your cards (with stats)
GET    /api/cards/:id                Fetch a card
PUT    /api/cards/:id                Update a card
DELETE /api/cards/:id                Delete a card
POST   /api/cards/:id/avatar        Upload image (kind=avatar|bg|qrlogo)

GET    /api/u/:username              Public card JSON

GET|POST /api/wallet/apple/:cardId   Signed .pkpass file
POST     /api/wallet/google/:cardId  Save-to-Google-Wallet URL

GET|POST /api/qr/:cardId             QR code (?format=png|svg&size=…)
GET      /api/vcf/:cardId            vCard download

POST   /api/analytics/scan/:cardId   Track view/scan/click
GET    /api/analytics/:cardId        Counts + 30-day daily series (owner only)
```

All public endpoints are rate-limited (100 req/min per IP by default).

## Apple Wallet setup

Passes must be signed with an Apple Pass Type ID certificate:

1. Enroll in the [Apple Developer Program](https://developer.apple.com/programs/) ($99/year)
2. Create a **Pass Type ID** (e.g. `pass.com.carddrop.businesscard`) in Certificates, Identifiers & Profiles
3. Create a certificate for it, download and export the signer certificate + private key as PEM
4. Download the [Apple WWDR G4 intermediate certificate](https://www.apple.com/certificateauthority/)
5. Base64-encode each PEM and set:

```env
APPLE_TEAM_ID=XXXXXXXXXX
APPLE_PASS_TYPE_ID=pass.com.carddrop.businesscard
APPLE_CERT_PEM_BASE64=$(base64 -i signerCert.pem)
APPLE_CERT_KEY_PEM_BASE64=$(base64 -i signerKey.pem)
APPLE_CERT_PASSWORD=your-key-passphrase
APPLE_WWDR_CERT_BASE64=$(base64 -i wwdr.pem)
```

Icons, logos, and thumbnails are generated on the fly with `sharp` — passes are never stored on the server.

## Google Wallet setup

1. Create a Google Cloud project and enable the **Google Wallet API**
2. Create a service account and download its JSON key
3. Sign up as an issuer in the [Google Pay & Wallet Console](https://pay.google.com/business/console) (free)
4. Set:

```env
GOOGLE_WALLET_SERVICE_ACCOUNT_JSON='{"client_email":"...","private_key":"..."}'
GOOGLE_PAY_ISSUER_ID=3388000000000000000
GOOGLE_WALLET_CLASS_ID=carddrop_business_card
```

The generic class is created lazily on first save (it&apos;s included in the JWT payload).

Until wallet credentials are configured, the wallet endpoints return a clear `501` message and the rest of the app works normally.

## Production notes

- **Database**: switch `provider` in `prisma/schema.prisma` to `postgresql` and point `DATABASE_URL` at Supabase/Neon/RDS
- **Images**: uploads are resized with sharp and stored as compact data URIs in the database — swap `src/app/api/cards/[id]/avatar/route.ts` for S3/R2 if you prefer object storage
- **Rate limiting**: in-memory sliding window; use Upstash Redis for multi-instance deployments
- **Email**: set the `SMTP_*` variables to deliver real magic-link emails
- **CORS**: API responses allow only `NEXT_PUBLIC_APP_URL`
