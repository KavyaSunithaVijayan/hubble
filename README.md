# Hubble — Landing Page & Exhibitor Scraper

Full-stack project built for the Cavliwireless Web Developer task brief. Two parts sharing one database:

1. **Hubble Landing Page** — Next.js + Tailwind CSS landing page with product detail pages, live data, and a "Consult Now" form.
2. **Exhibitor Scraper** — Node/TypeScript scraper that pulls data from MMI Connect and upserts it into a normalized SQL database.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router), TypeScript
- **Styling:** Tailwind CSS 4
- **ORM / Database:** Prisma 6 + PostgreSQL
- **Data fetching (client):** TanStack React Query, Axios
- **Forms:** React Hook Form
- **Icons:** Lucide React
- **Scraper:** Node/TypeScript script run via `tsx`

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
# Update DATABASE_URL to point to your Postgres instance

# 4. Run database migrations
npx prisma migrate dev

# 5. (Optional) Seed the database with sample data
npx prisma db seed

# 6. Start the dev server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Available Scripts

| Command                  | Description                                         |
| ------------------------ | --------------------------------------------------- |
| `npm run dev`            | Start the Next.js dev server                        |
| `npm run build`          | Build for production                                |
| `npm run start`          | Start the production server                         |
| `npm run lint`           | Run ESLint                                          |
| `npx prisma migrate dev` | Apply database migrations locally                   |
| `npx prisma db seed`     | Seed the database (runs `prisma/seed.ts` via `tsx`) |
| `npx prisma studio`      | Open Prisma Studio to inspect data                  |

### Environment Variables

| Variable       | Description                |
| -------------- | -------------------------- |
| `DATABASE_URL` | Postgres connection string |

---

## Database Schema

Schema defined in `prisma/schema.prisma`, normalized to **Third Normal Form (3NF)**.

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

| Column        | Type                   | Notes                                               |
| ------------- | ---------------------- | --------------------------------------------------- |
| `id`          | Int (PK)               | `customer.id` from the API — used as the upsert key |
| `companyName` | String                 |                                                     |
| `squareLogo`  | String?                | Nullable                                            |
| `userId`      | String?                | Nullable                                            |
| `boothNo`     | String?                | Nullable                                            |
| `hallNo`      | String?                | Nullable                                            |
| `showId`      | Int (FK → Show.id)     |                                                     |
| `countryId`   | Int? (FK → Country.id) | Nullable                                            |
| `createdAt`   | DateTime               |                                                     |
| `updatedAt`   | DateTime               |                                                     |

### `ExhibitorProduct`

| Column         | Type                    | Notes                                              |
| -------------- | ----------------------- | -------------------------------------------------- |
| `id`           | Int (PK)                | `product.id` from the API — used as the upsert key |
| `productName`  | String                  |                                                    |
| `productType`  | String?                 | Nullable                                           |
| `productImage` | String?                 | Nullable                                           |
| `specialType`  | String?                 | Nullable                                           |
| `showId`       | Int                     |                                                    |
| `exhibitorId`  | Int (FK → Exhibitor.id) | Required                                           |
| `createdAt`    | DateTime                |                                                    |
| `updatedAt`    | DateTime                |                                                    |

### `Product`

Landing page's own showcased products/features (independent of the scraped exhibitor data).

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
| `phone`     | String            | Required                   |
| `company`   | String?           | Optional                   |
| `message`   | String            | Required                   |
| `createdAt` | DateTime          |                            |

### Why this satisfies 3NF

- **1NF:** All columns hold atomic values — country and show are separate entities rather than free-text fields duplicated on every exhibitor row.
- **2NF:** Every table uses a single-column primary key, so there are no partial-key dependencies to worry about.
- **3NF:** No transitive dependencies — `Country.name` and `Show.name`/dates live only in their own tables and are referenced by `Exhibitor` via foreign key, rather than being repeated on every `Exhibitor` or `ExhibitorProduct` row. Updating a show's dates or a country's name requires touching exactly one row.

---

## How to Trigger the Scraper

The scraper can be run via an API endpoint:

```bash
curl -X POST http://localhost:3000/api/scrape/exhibitors
```

**Current behavior:** the scraper (`scrapeExhibitorProducts` in `lib/scraper.ts`) fetches paginated results from the MMI Connect GraphQL endpoint (`https://mmiconnect.in/graphql`, `getProductListForGroup` query) and upserts them into `ExhibitorProduct`, keyed by `product.id`.

- Paginates automatically until all results for the `ep-blr-2026` group are fetched
- Upserts by `id` — re-running the scraper updates existing rows instead of creating duplicates

Example response:

```json
{
  "fetched": 84,
  "reportedTotal": 84
}
```

> **Known limitation:** this only populates `ExhibitorProduct`. Each product references `exhibitor.id`, but the scraper does not yet fetch or upsert the corresponding `Exhibitor` (or `Show`/`Country`) rows from the dedicated exhibitors endpoint (`/app/catalogue/exhibitors/ep-blr-2026?first=100`), so it will fail with a foreign-key constraint error unless matching `Exhibitor` rows already exist. Fetching and upserting exhibitors ahead of products is a planned next step / open item.

---

## API Endpoints

| Method | Endpoint                 | Description                                                                                                                          |
| ------ | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `POST` | `/api/consult`           | Submits the "Consult Now" form. Validates `name`, `email`, `message` (required) and email format. Returns inline success/error JSON. |
| `POST` | `/api/scrape/exhibitors` | Triggers the exhibitor scraper.                                                                                                      |
| `GET`  | `/products/[slug]`       | Product detail page for each showcased feature.                                                                                      |

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
│   │   │   ├── consult/           # POST /api/consult
│   │   │   └── scrape/            # POST /api/scrape/exhibitors
│   │   ├── products/              # /products/[slug]
│   │   ├── components/
│   │   │   ├── ConsultForm.tsx
│   │   │   ├── Footer.tsx         # Displays live exhibitor data
│   │   │   ├── Header.tsx         # Displays live exhibitor data
│   │   │   ├── ProductCard.tsx
│   │   │   └── QueryProvider.tsx  # React Query provider
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx               # Landing page
│   ├── generated/                 # Prisma client output
│   └── lib/
│       ├── api.ts
│       ├── prisma.ts              # Prisma client instance
│       └── scrapeExhibitors.ts    # Scraper logic
├── .env
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── prisma.config.ts
├── tsconfig.json
└── README.md
---


```
