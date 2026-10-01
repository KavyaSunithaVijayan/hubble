# Hubble — Landing Page, Product Pages & Exhibitor Scraper

Full-stack project built for the Cavliwireless Web Developer task brief. Two parts share one PostgreSQL database:

1. **Hubble Landing Page** — Next.js + Tailwind CSS site with a redesigned UI, product detail pages with an interactive 3D model viewer, and a "Consult Now" form with Google Meet booking.
2. **Exhibitor Scraper** — Node/TypeScript scraper that pulls exhibitor data from MMI Connect into a normalized SQL database. The data is shown live in the site's header and footer.

---

## Demo

- **Screen recording:** `https://drive.google.com/file/d/1Zyd85pPuPlnAEATpcnr8B-IjqMEwgsAM/view?usp=sharing`

The demo shows the landing page, a product detail page with the 3D viewer, the Consult Now booking flow, and the header/footer exhibitor data.

---

## Features

### Landing page (`/`)

- Redesigned dark UI built with Tailwind CSS 4, fully responsive.
- Showcases 4–5 products/features sourced from Cavli Wireless (`src/lib/products.ts`).
- Each product card links to its own detail page at `/products/[slug]`.

### Product detail page (`/products/[slug]`)

- Product content (overview, specs, highlights) comes from the Cavli Wireless data in `src/lib/productDetails.ts`.
- **3D model viewer** renders the `.glb` asset with interactive rotate and zoom controls.
  - Library: `@google/model-viewer`.
  - Responsive container, so the layout does not break on mobile.
  - Loading state is shown until the model is ready, with a fallback if it fails to load.

### Header & footer (live exhibitor data)

- `Header.tsx` and `Footer.tsx` read exhibitor data from the database.
- That data is populated by the scraper (see below), so it is live rather than hardcoded.
- `/exhibitors` lists the full set of scraped exhibitors using `ExhibitorCard.tsx`.

### Consult Now (with Google Meet booking)

- Fields: name, email, phone, company (optional), message.
- Validation: name, email (valid format) and message are required.
- After submitting, the user picks an available time slot. A slot must be selected before confirming.
- On confirmation, a Google Calendar event is created with a Google Meet link, and the user receives a confirmation email with the invite and link.
- Inline success/error feedback at every step, with no page reloads.
- All submissions are saved to the database via `POST /api/consult`.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router), TypeScript
- **Styling:** Tailwind CSS 4
- **3D:** `@google/model-viewer`
- **ORM / Database:** Prisma 6 + PostgreSQL
- **Data fetching (client):** TanStack React Query, Axios
- **Forms:** React Hook Form
- **Icons:** Lucide React
- **Scraper:** Node/TypeScript, run via `tsx`

---

## Project Setup

### Prerequisites

- Node.js 18+
- A PostgreSQL database
- npm / yarn

### Run locally

```bash
# 1. Clone the repo
git clone https://github.com/KavyaSunithaVijayan/hubble.git
cd hubble

# 2. Install dependencies
npm install
# postinstall runs `prisma generate` automatically

# 3. Set up environment variables
cp .env.example .env
# Fill in the values listed below

# 4. Run database migrations
npx prisma migrate dev

# 5. (Optional) Seed the database with sample data
npx prisma db seed

# 6. Populate exhibitor data (needed for the header/footer)
npm run dev
curl -X POST http://localhost:3000/api/scrape/exhibitors
```

The app will be available at `http://localhost:3000`.

### Environment Variables

| Variable               | Description                                  |
| ---------------------- | -------------------------------------------- |
| `DATABASE_URL`         | Postgres connection string                   |
| `GOOGLE_CLIENT_ID`     | Google OAuth / service account client ID     |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret                   |
| `GOOGLE_REFRESH_TOKEN` | Refresh token for the calendar owner account |
| `GOOGLE_CALENDAR_ID`   | Calendar used for booking (e.g. `primary`)   |

### Available Scripts

| Command                  | Description                          |
| ------------------------ | ------------------------------------ |
| `npm run dev`            | Start the Next.js dev server         |
| `npm run build`          | Build for production                 |
| `npm run start`          | Start the production server          |
| `npm run lint`           | Run ESLint                           |
| `npx prisma migrate dev` | Apply database migrations locally    |
| `npx prisma db seed`     | Seed the database (`prisma/seed.ts`) |
| `npx prisma studio`      | Inspect data in Prisma Studio        |

---

## Data Flow

```
MMI Connect (GraphQL / REST)
        │  POST /api/scrape/exhibitors
        ▼
  scrapeExhibitors.ts ──► PostgreSQL (Show, Country, Exhibitor, ExhibitorProduct)
                                   │
                                   ▼
                   Header, Footer, /exhibitors  (live exhibitor data)

Cavli Wireless content ──► lib/products.ts, lib/productDetails.ts
                                   │
                                   ▼
                   Landing page (/)  and  /products/[slug]  (+ 3D viewer)
```

- **Exhibitor data** is scraped from MMI Connect, stored in the database, then read by the header, footer and `/exhibitors` page.
- **Product content** for the landing page and detail pages comes from Cavli Wireless and is kept in `src/lib/products.ts` and `src/lib/productDetails.ts`.

---

## Database Schema

Defined in `prisma/schema.prisma`, normalized to **Third Normal Form (3NF)**.

### `Show`

| Column      | Type     | Notes                 |
| ----------- | -------- | --------------------- |
| `id`        | Int (PK) | `showId` from the API |
| `name`      | String   |                       |
| `startDate` | DateTime |                       |
| `endDate`   | DateTime |                       |

### `Country`

| Column | Type                    | Notes |
| ------ | ----------------------- | ----- |
| `id`   | Int (PK, autoincrement) |       |
| `name` | String (unique)         |       |

### `Exhibitor`

| Column                    | Type                   | Notes                                              |
| ------------------------- | ---------------------- | -------------------------------------------------- |
| `id`                      | Int (PK)               | `customer.id` from the API, used as the upsert key |
| `companyName`             | String                 |                                                    |
| `squareLogo`              | String?                | Nullable                                           |
| `userId`                  | String?                | Nullable                                           |
| `boothNo`                 | String?                | Nullable                                           |
| `hallNo`                  | String?                | Nullable                                           |
| `showId`                  | Int (FK → Show.id)     |                                                    |
| `countryId`               | Int? (FK → Country.id) | Nullable                                           |
| `createdAt` / `updatedAt` | DateTime               |                                                    |

### `ExhibitorProduct`

| Column                    | Type                    | Notes                                             |
| ------------------------- | ----------------------- | ------------------------------------------------- |
| `id`                      | Int (PK)                | `product.id` from the API, used as the upsert key |
| `productName`             | String                  |                                                   |
| `productType`             | String?                 | Nullable                                          |
| `productImage`            | String?                 | Nullable                                          |
| `specialType`             | String?                 | Nullable                                          |
| `showId`                  | Int                     |                                                   |
| `exhibitorId`             | Int (FK → Exhibitor.id) | Required                                          |
| `createdAt` / `updatedAt` | DateTime                |                                                   |

### `Product`

The landing page's own showcased products (independent of scraped exhibitor data).

| Column        | Type              | Notes                       |
| ------------- | ----------------- | --------------------------- |
| `id`          | String (PK, cuid) |                             |
| `name`        | String            |                             |
| `slug`        | String (unique)   | Used for `/products/[slug]` |
| `tagline`     | String?           | Nullable                    |
| `description` | String            |                             |

### `ConsultRequest` (maps to `consult_requests`)

| Column      | Type              | Notes                      |
| ----------- | ----------------- | -------------------------- |
| `id`        | String (PK, cuid) |                            |
| `name`      | String            | Required                   |
| `email`     | String            | Required, validated format |
| `phone`     | String?           | Optional                   |
| `company`   | String?           | Optional                   |
| `message`   | String            | Required                   |
| `slot`      | DateTime?         | Selected time slot         |
| `meetLink`  | String?           | Google Meet link           |
| `createdAt` | DateTime          |                            |

### Why this satisfies 3NF

- **1NF:** All columns hold atomic values. Country and show are separate entities rather than free text repeated on every exhibitor row.
- **2NF:** Every table uses a single-column primary key, so there are no partial-key dependencies.
- **3NF:** No transitive dependencies. `Country.name` and `Show.name`/dates live only in their own tables and are referenced by foreign key, so changing one updates exactly one row.

---

## Exhibitor Scraper

Trigger it with:

```bash
curl -X POST http://localhost:3000/api/scrape/exhibitors
```

The scraper (`src/lib/scrapeExhibitors.ts`):

1. Fetches exhibitors for the `ep-blr-2026` group and upserts `Show`, `Country` and `Exhibitor` rows.
2. Fetches paginated products from the MMI Connect GraphQL endpoint (`https://mmiconnect.in/graphql`, `getProductListForGroup`) and upserts `ExhibitorProduct`.
3. Upserts by `id`, so re-running updates existing rows instead of creating duplicates.

Exhibitors are written before products so the foreign keys always resolve.

Example response:

```json
{ "fetched": 84, "reportedTotal": 84 }
```

---

## API Endpoints

| Method | Endpoint                 | Description                                                                            |
| ------ | ------------------------ | -------------------------------------------------------------------------------------- |
| `POST` | `/api/consult`           | Saves a Consult Now submission. Validates `name`, `email`, `message` and email format. |
| `POST` | `/api/scrape/exhibitors` | Runs the exhibitor scraper.                                                            |
| `GET`  | `/products/[slug]`       | Product detail page with 3D viewer.                                                    |
| `GET`  | `/exhibitors`            | Browse scraped exhibitors.                                                             |

---

## Project Structure

```
hubble/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── consult/route.ts              # POST /api/consult
│   │   │   └── scrape/exhibitors/route.ts    # POST /api/scrape/exhibitors
│   │   ├── exhibitors/page.tsx               # Exhibitor listing
│   │   ├── products/[slug]/page.tsx          # Product detail + 3D viewer
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                          # Landing page
│   ├── components/
│   │   ├── product/                          # Product page components (3D viewer, etc.)
│   │   ├── ConsultForm.tsx
│   │   ├── ExhibitorCard.tsx
│   │   ├── Footer.tsx                        # Live exhibitor data
│   │   ├── Header.tsx                        # Live exhibitor data
│   │   └── QueryProvider.tsx                 # React Query provider
│   ├── generated/                            # Prisma client output
│   ├── lib/
│   │   ├── api.ts
│   │   ├── prisma.ts                         # Prisma client instance
│   │   ├── productDetails.ts                 # Product detail content
│   │   ├── products.ts                       # Landing page products
│   │   └── scrapeExhibitors.ts               # Scraper logic
│   └── types/
│       └── page.ts
├── .env
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── prisma.config.ts
├── tsconfig.json
└── README.md

```
