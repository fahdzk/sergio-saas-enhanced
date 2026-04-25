# Sergio's RealEstate CRM Build Guide - Twenty Edition

This adapts the uploaded `Sergio_RealEstate_CRM_Build_Guide.docx` to use Twenty as the main CRM.

## Product Goal

Build Sergio's private real estate command center first, then grow it into a sellable SaaS for other agents.

Primary market:

- Salt Lake City, Utah
- Lehi, Utah
- Provo and surrounding Utah markets

Primary clients:

- Luxury home buyers
- Homeowners upgrading to a forever home
- Utah real estate investors

## Architecture

Twenty replaces the custom Supabase CRM foundation from the original guide.

| Original guide item | Twenty edition |
| --- | --- |
| Supabase Auth | Twenty workspace auth |
| Supabase tables | Twenty standard objects + custom objects |
| Custom dashboard from scratch | Twenty dashboards/views first, companion app later |
| Leads table | Twenty People + Opportunities |
| Properties table | Twenty custom `Property` object |
| Emails table | Twenty notes/activities plus Resend event records |
| Activities table | Twenty timeline activities |
| SaaS multi-tenancy | Twenty workspaces |
| Replit prototype | Local Docker first, deploy self-hosted later |

## Phase 1 - Sergio CRM

Run Twenty locally with Docker and create one workspace:

- Workspace name: `Sergio's RealEstate`
- Admin user: Sergio
- Profile photo: imported from Sergio's public UtahRealEstate roster page after review
- Primary CRM views:
  - New Leads
  - Contacted
  - Interested
  - Closed
  - Luxury Buyers
  - Upsizing Homeowners
  - Investors

## Twenty Data Model

Use built-in Twenty objects where possible.

People:

- Name
- Email
- Phone
- City
- Lead source
- Tags

Opportunities:

- Name
- Stage: New, Contacted, Interested, Closed
- Amount
- Close date
- Point of contact
- Notes

Companies:

- Brokerages
- Investor groups
- Vendors

Tasks:

- Follow up
- Send listing
- Book showing
- Request pre-approval
- Send marketing plan

## Custom Objects

Create these in Twenty after the first workspace is live.

Property:

- Title
- Price
- Location
- Description
- Public URL
- Share link
- Image URLs
- Tags
- Status: Draft, Active, Private Preview, Under Contract, Sold

Closed Sale:

- Address
- City
- Sale date
- Role: Listing Agent or Buyer's Agent
- Source URL
- Property image URL
- Notes

Lead Source:

- Source name
- Source type: SEO, Google Ads, Referral, Manual, Scraper
- Campaign
- Landing page URL
- Cost

Email Campaign:

- Template name
- Subject
- Body
- Audience tag
- Sent count
- Open count
- Reply count
- Resend event IDs

## Companion App

Twenty is the CRM. A small Next.js companion app can handle things Twenty should not own directly:

- Public SEO landing pages
- Lead capture forms
- Google Ads conversion pages
- Crawl4AI scraper workflows
- Resend bulk email workflows
- AI email generator

The companion app writes leads, properties, campaigns, and activities into Twenty through the Twenty API.

## Enterprise Import System

The uploaded enterprise SaaS scraper spec is implemented as a companion import page:

Route:

`http://localhost:3000/import` or whichever port the Next.js companion app is running on.

API routes:

- `POST /api/import-preview`
- `POST /api/import-save`
- `GET /api/import-logs`

Preview flow:

1. Validate URL format.
2. Block restricted domains.
3. Check robots.txt.
4. Rate limit to 10 preview requests per minute per client.
5. Try Crawl4AI first.
6. Fall back to basic Cheerio extraction.
7. Extract title, description, images, price, and source.
8. Write a local scraping log.
9. Let Sergio review before saving.

Save flow:

1. User selects `Property` or `Lead`.
2. User clicks Save to Twenty.
3. Companion app calls the Twenty REST API if `TWENTY_API_KEY` is configured.
4. If the API key is missing, the system still logs the reviewed import and reports that Twenty save is pending.

Before production, create the matching custom objects and fields in Twenty, then update `lib/twenty.ts` endpoints if the generated object API names differ.

## Required Pages From The Uploaded Guide

Dashboard:

- Use Twenty views and dashboards for CRM activity.
- Add a companion analytics page later if Sergio needs Google Ads and landing page metrics in one place.

Leads:

- Use Twenty Opportunities in a Kanban view.
- Stages: New, Contacted, Interested, Closed.

Properties:

- Use the `Property` custom object.
- Populate it manually or through the Crawl4AI property scraper.

Email Center:

- Use the companion app for Resend sending, tracking, reply webhooks, and AI generation.
- Log sent emails and replies back into Twenty.

Landing Pages:

- Keep as Next.js public pages.
- Landing pages create People and Opportunities in Twenty.

Safe Scraper:

- Crawl4AI runs in Docker.
- The scraper checks public/authorized URLs only.
- The scraper saves reviewed property data to Twenty.
- The data import page provides URL input, type selector, preview card, save action, and scraping history.

Google Ads:

- Ads point to the companion app landing pages.
- UTM parameters are captured and stored as Lead Source records in Twenty.

## Sergio Public Profile Import

The public roster URL:

`https://www.utahrealestate.com/roster/agent.listings.report/agentid/1319245`

Import flow:

1. Start Docker Desktop.
2. Start Twenty with `Start_Twenty_Sergio_CRM.bat`.
3. Run `node .\scripts\scrape-sergio-profile.mjs`.
4. Run `node .\scripts\prepare-twenty-import.mjs`.
5. Review `data/sergio-admin-profile.json`.
6. Review `data/sergio-sales.csv`.
7. Use the reviewed photo candidate as Sergio's admin avatar.
8. Import verified sold listings as `Closed Sale` records.

No sale, address, or photo should be used unless it is present in the public roster output or Sergio provides it directly.

## Phase 2 - SaaS

Twenty already supports workspace separation, which maps cleanly to SaaS.

Future SaaS model:

- One workspace per agent or brokerage
- Stripe billing outside Twenty
- Starter: $49/month
- Pro: $99/month
- Team: $199/month
- Enterprise: custom

The companion app handles:

- Marketing site
- Signup flow
- Stripe Checkout
- Workspace provisioning
- Agent onboarding

## Compliance Notes

- Only email people with consent or legitimate opt-in.
- Include business name, mailing address, and unsubscribe link in bulk emails.
- Do not scrape Zillow, Redfin, Realtor.com, login-only pages, or private databases.
- Respect robots.txt.
- Keep a privacy policy and terms before selling as SaaS.
