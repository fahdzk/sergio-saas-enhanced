# Sergio's RealEstate on Twenty CRM

This folder is the rebuild path for moving Sergio's RealEstate onto [Twenty](https://github.com/twentyhq/twenty), the open-source CRM.

The uploaded build guide is adapted in `SERGIO_TWENTY_BUILD_GUIDE.md`.

## Why Twenty

Twenty is a full CRM platform with people, companies, opportunities, tasks, custom fields, REST APIs, GraphQL APIs, PostgreSQL, Redis, and background workers. Their official self-hosting path uses Docker Compose.

In this project, Twenty is the main CRM. A small companion app can later handle real-estate-specific public pages, Crawl4AI scraping, Resend email sending, Google Ads tracking, and AI email generation.

## Data import and scraping

The companion Next.js app includes an enterprise-style importer at `/import`.

It supports:

- URL input
- Property / Lead selector
- Preview result card
- Save-to-Twenty action
- Scraping history
- Crawl4AI first, basic extractor fallback
- URL validation, restricted-domain blocking, robots.txt checks, and 10 requests/minute rate limiting

To enable saving into Twenty, create a Twenty API key and add it to the root `.env.local`:

```env
TWENTY_API_URL=http://localhost:3005
TWENTY_API_KEY=your_twenty_api_key
```

## One-click setup

1. Install and open Docker Desktop.
2. Double-click `Start_Twenty_Sergio_CRM.bat`.
3. Open `http://localhost:3005`.
4. Create the first workspace and admin user for Sergio.

This setup keeps the current prototype untouched while Twenty becomes the new CRM foundation.

## Sergio profile import

After Twenty is running:

1. In Twenty, go to Settings -> APIs & Webhooks.
2. Create an API key.
3. Copy `.env.example` to `.env`.
4. Add the API key to `TWENTY_API_KEY`.
5. Run:

```powershell
node .\scripts\scrape-sergio-profile.mjs
node .\scripts\prepare-twenty-import.mjs
```

The scripts create:

- `data/sergio-profile-scrape.json`
- `data/sergio-admin-profile.json`
- `data/sergio-sales.csv`

The importer does not invent sales data. It only uses what can be extracted from Sergio's public UtahRealEstate roster page.

## What to build inside Twenty

- Kanban opportunities with stages: New, Contacted, Interested, Closed
- Views for Luxury Buyers, Upsizing Homeowners, Investors, Google Ads Leads, SEO Leads
- Custom object: Property
- Custom object: Closed Sale
- Custom object: Lead Source
- Custom object: Email Campaign
- Tasks for follow-up, showings, listing sends, and marketing strategy calls

## Guardrails

- Public or authorized pages only
- Respect robots.txt and platform restrictions
- No login-wall bypassing
- No private database scraping
- No copying data from restricted platforms

## Official docs used

- Twenty self-hosting: https://docs.twenty.com/developers/self-host/self-host
- Twenty Docker Compose: https://twenty.com/developers/section/self-hosting/docker-compose
- Twenty API: https://docs.twenty.com/developers/api-and-webhooks/api
