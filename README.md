# Sergio's Listings

Local-first SaaS workspace for Sergio's Utah real estate operation.

## What is included

- Next.js App Router application
- Dashboard, for-sale, for-rent, buyer, renter, map, email, and settings modules
- Real CRUD API routes for listings and clients backed by Supabase/Postgres
- Google Maps JavaScript API integration for live map rendering when a browser key is present
- BillionMail send route wired to the documented send endpoint with `X-API-Key`
- Settings page with Supabase seeding flow and integration readiness checks
- Crawl4AI-ready scraper integration with a basic extractor fallback
- Enterprise data import page at `/import` with preview, save-to-Twenty, and scraping history

## Environment

Copy `.env.example` to `.env.local` and fill in values when you are ready to connect live services.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
BILLIONMAIL_API_URL=
BILLIONMAIL_API_KEY=
BILLIONMAIL_SEND_ENDPOINT="/api/batch_mail/api/send"
RESEND_API_KEY=
EMAIL_FROM="Sergio's RealEstate <hello@example.com>"
CRAWL4AI_BASE_URL="http://localhost:11235"
CRAWL4AI_API_TOKEN=
```

## Crawl4AI integration

The CRM can call a local Crawl4AI Docker server for browser-based crawling and LLM-friendly Markdown extraction.

```bash
docker run -d ^
  -p 11235:11235 ^
  --name crawl4ai ^
  --shm-size=3g ^
  unclecode/crawl4ai:latest
```

Once `CRAWL4AI_BASE_URL` is set, the `/api/scrape` endpoint sends permitted URLs to Crawl4AI first. If Crawl4AI is
offline or not configured, the endpoint falls back to the built-in basic extractor.

The CRM keeps guardrails in front of crawling:

- Public or authorized pages only
- robots.txt checked before any crawl request
- Known restricted platforms blocked by hostname
- No private databases, login walls, or bypassing access controls

## Twenty data import

Run Twenty at `http://localhost:3005`, then run this companion app and open:

```text
http://localhost:3000/import
```

If the Next.js dev server chooses another port, use that port instead.

To save reviewed records into Twenty, add these to `.env.local`:

```env
TWENTY_API_URL=http://localhost:3005
TWENTY_API_KEY=your_twenty_api_key
```

The importer logs previews and save attempts locally in `data/scraping-logs.json`.

## Supabase schema

Run the SQL in:

```text
supabase/sergios_listings_schema.sql
```

Then seed the starter records from the Settings tab inside the app.

## BillionMail integration

The send route posts to the BillionMail endpoint documented in the official email API guide:

- default endpoint: `/api/batch_mail/api/send`
- auth header: `X-API-Key: ...`

If your BillionMail instance uses a different path, set `BILLIONMAIL_SEND_ENDPOINT`.

## Run locally

Double-click:

```text
Run_Sergios_Listings_Local.bat
```

Or run manually:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.
