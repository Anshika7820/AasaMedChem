# AasaMedChem Inventory & Order Management System

A Next.js inventory, quotation, and order management app for medchem and chemical products.

## Current State

This repository is a working browser demo. Data is currently persisted in `localStorage`, so the app runs without a real backend database during local development and build verification.

The repo also contains a Prisma schema that documents the data model for a production database. The hackathon brief asks for Neon PostgreSQL, but the current codebase is not yet wired to Neon. That is the main gap to close before final submission.

## Feature Map

### Public and auth flow

- Landing page with product-focused hero content
- Login page
- Seller registration page
- Demo credentials for Admin, Seller, and User roles

### Seller/User features

- Browse products
- Search and filter products
- View product details
- Add products to cart
- Enter quantities in supported units
- See converted quantity and calculated price
- Place orders
- Request quotations
- View order and quotation history
- Access a role-protected dashboard

### Admin features

- Admin dashboard with summary metrics
- Create, edit, and soft-delete products
- View inventory and inventory value
- View and update incoming orders
- View and update quotations
- View user list and roles

### Shared system behavior

- Role-based navigation
- Protected routes for Admin, Seller, and User views
- Unit conversion for grams, kilograms, milliliters, liters, and items
- INR price formatting in the UI

## Demo Credentials

Admin:

```txt
Email: admin@aasamedchem.com
Password: admin123
```

Seller:

```txt
Email: seller@test.com
Password: seller123
```

User:

```txt
Email: user@test.com
Password: user123
```

## Tech Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- Prisma ORM schema
- Zod for validation helpers
- lucide-react icons

## Architecture

Frontend pages live in `app/` and use reusable UI components from `components/`. The app uses a shared client-side store in `lib/store.ts` and a state hook in `lib/useAppState.ts` to keep demo data in sync across pages.

Database access is modeled through Prisma in `prisma/schema.prisma`, and `lib/db.ts` creates a singleton Prisma client. In the current demo, the API routes do not yet read from the database; they mainly serve as placeholders while the browser store powers the app.

## Authentication and Roles

Authentication is currently handled on the client with browser storage. A session key stores the logged-in user id, and the `Protected` component redirects unauthenticated users to `/login`. It also checks role access and sends Admin and Seller/User accounts to their matching dashboards.

Important note: passwords are not hashed yet because the current demo auth is local-storage based. For a production hackathon submission, this should be moved to server-side auth with hashed passwords and secure cookies or tokens.

## Unit Storage and Conversion Strategy

The app stores quantities in a canonical base unit so calculations stay consistent:

- Weight products use grams as the base unit
- Volume products use milliliters as the base unit
- Count-based products use item as the base unit

Conversion rules:

- `1 kg = 1000 g`
- `1 L = 1000 mL`
- `1 item = 1 item`

Conversions are applied before pricing and before saving the converted quantity to the order or quotation item.

Example:

```txt
Base unit: mL
Price: Rs. 0.5 per mL
User enters: 2 L
Converted quantity: 2000 mL
Total price: Rs. 1000
```

The conversion helpers are in `lib/conversion.ts`.

## Data Types and Precision

The current Prisma schema stores quantities and prices as strings for precision in the demo model:

```prisma
stockQuantity String
pricePerBaseUnit String
totalAmount String
quantityEntered String
convertedQuantity String
amount String
```

This is useful for preserving precision in the model, but the demo store currently uses JavaScript numbers in `lib/store.ts` for quick calculations. If you move this to Neon PostgreSQL, the recommended production choice is PostgreSQL `NUMERIC` for quantities, rates, and totals.

## Database Models

The schema defines:

- User
- Category
- Product
- Order
- OrderItem
- Quotation
- QuotationItem

See `prisma/schema.prisma`.

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Current Validation

The project compiles successfully with:

```bash
npm run build
```

I also checked linting, but `next lint` originally opened an ESLint setup prompt because the repo did not have an ESLint config. The included `.eslintrc.json` fixes that so linting runs non-interactively.

## Deployment Notes

The app can be deployed to Vercel as a browser demo right now because it is static-client driven.

For the hackathon brief, the next step is to replace the browser store with Neon PostgreSQL-backed Prisma queries, then configure these environment variables in Vercel:

```env
DATABASE_URL="your-neon-postgres-connection-string"
```

If you keep the current demo architecture, deployment will work as a browser demo, but it will not meet the Neon PostgreSQL requirement.

## README Summary for Submission

- Frontend: Next.js pages and reusable components
- Backend: Next.js route handlers plus a Prisma client stub
- Database: demo localStorage today, Prisma schema ready for a real database
- Auth: client-side session + role-based route protection
- Conversion: all quantities normalize to a base unit before pricing
- Deployment: Vercel-ready build, but Neon/Postgres integration still needs to be completed for full assignment compliance
