# Migration Path

## Decision

Use Twenty as the CRM foundation instead of rebuilding every CRM primitive ourselves. The uploaded build guide still defines the product, market, features, and rollout plan.

Twenty already provides:

- Accounts/workspaces
- People and companies
- Opportunities
- Tasks and notes
- Custom fields and custom objects
- Kanban/table views
- REST and GraphQL APIs
- PostgreSQL-backed data ownership

## Sergio-specific model

Configure Twenty with:

- Workspace: Sergio's RealEstate
- Admin profile: Sergio
- Custom object: Property
- Custom object: Closed Sale
- Custom object: Lead Source
- Custom fields on Opportunities:
  - Budget
  - Buyer type
  - Property interest
  - Lead temperature
  - Source URL

## Current prototype pieces to port

- Utah real estate landing page funnels
- Public-page scraper powered by Crawl4AI
- AI email draft generator
- Property marketing cards
- Sergio public sales import
- Google Ads and UTM lead attribution
- SaaS upgrade path with Stripe billing

## Import order

1. Start Twenty.
2. Create Sergio's workspace and admin user.
3. Create an API key in Twenty.
4. Scrape Sergio's public roster profile.
5. Review `data/sergio-sales.csv`.
6. Import verified sales into Twenty as Closed Sale records or Opportunities.

## Notes

Twenty generates API docs from the workspace data model, so the final import script should be adjusted after the custom objects are created and the API schema is visible in Settings -> APIs & Webhooks.

## Uploaded Guide Mapping

The original guide is Next.js + Supabase + Resend + Vercel. In the Twenty rebuild:

- Twenty replaces Supabase for CRM data and auth.
- Twenty workspaces replace future SaaS organization separation.
- Next.js remains useful as a companion app for landing pages, scraper workflows, Resend emails, AI email generation, and Google Ads conversion tracking.
- Docker replaces Replit for local CRM development because Twenty is a full multi-service platform.
