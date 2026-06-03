# AasaMedChem Inventory & Order Management System

A full-stack style inventory, quotation, and order management project for a medchem/chemical product assignment.

The current app is demo-ready and works immediately in the browser using seeded local storage. It also includes a Prisma MongoDB schema so the same data model can be connected to MongoDB Atlas for production.

## Features

- Admin login and seller login/register
- Role-based dashboards
- Product create, edit, and soft delete
- Inventory page with stock value calculation
- Product search, category filter, unit type filter, and sorting
- Live unit conversion and price calculation
- Cart flow
- Place orders
- Request quotations
- Admin order and quotation status management
- User order and quotation history
- Dashboard cards and simple category-wise inventory bars

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

## Tech Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Prisma ORM schema
- MongoDB Atlas ready
- Zod validation helpers
- lucide-react icons

## Unit Conversion Strategy

This is the most important assignment requirement.

All stock and order quantities are converted into base units before storage and pricing.

Weight:

```txt
Base unit: g
1 kg = 1000 g
1 g = 1 g
```

Volume:

```txt
Base unit: mL
1 L = 1000 mL
1 mL = 1 mL
```

Count:

```txt
Base unit: item
No conversion required
```

Prices are stored per base unit.

Example:

```txt
Product: Ethanol
Base unit: mL
Price: Rs. 0.5 per mL

User enters: 2 L
Converted quantity: 2 x 1000 = 2000 mL
Total price: 2000 x 0.5 = Rs. 1000
```

The conversion functions are in `lib/conversion.ts`.

## Decimal Precision

Prisma's MongoDB connector does not support the `Decimal` type directly, so the MongoDB schema stores high-precision numeric values as decimal strings:

```prisma
stockQuantity String
pricePerBaseUnit String
totalAmount String
```

Examples:

```txt
"50000.0000000000"
"0.8000000000"
"1600.0000000000"
```

This avoids floating-point rounding problems. In the UI/demo layer, calculations are done with numbers for speed and simplicity. In a production MongoDB API, parse these strings with `decimal.js` before calculation and save the result back as a string.

## Database Models

The schema contains:

- User
- Category
- Product
- Order
- OrderItem
- Quotation
- QuotationItem

See `prisma/schema.prisma`.

## Simple Viva Explanation

This project has two roles:

- Admin manages products, stock, inventory, users, orders, and quotations.
- Seller searches products, selects quantity/unit, gets automatic conversion and price, then places an order or quotation.

The main logic is unit conversion:

- Weight is stored in grams.
- Volume is stored in milliliters.
- Count is stored as items.
- Price is calculated after converting the entered quantity into the base unit.

The current deployed demo stores data in browser local storage so all pages work without a backend server setup. The MongoDB Prisma schema is included for connecting the same models to MongoDB Atlas.

## Run Locally

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Connect MongoDB Atlas

Create a free MongoDB Atlas cluster and copy the connection string into `.env`:

```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/aasamedchem?retryWrites=true&w=majority"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

Generate Prisma client:

```bash
npx prisma generate
```

MongoDB with Prisma does not use SQL migrations like PostgreSQL. For MongoDB, use:

```bash
npx prisma db push
```

## Fast Vercel Hosting Steps

1. Push this project to GitHub.
2. Open Vercel and import the GitHub repository.
3. Add environment variables:

```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/aasamedchem?retryWrites=true&w=majority"
NEXTAUTH_SECRET="your-long-random-secret"
NEXTAUTH_URL="https://your-vercel-app.vercel.app"
```

4. Keep build command as:

```bash
npm run build
```

5. Keep install command as:

```bash
npm ci
```

6. Deploy.

## Deployment

Deploy on Vercel.

Add these environment variables in Vercel:

```env
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
```

Never commit real secrets.

## Git Commit Plan

Recommended commits:

```txt
Initial Next.js setup
Added Prisma schema and database models
Added unit conversion logic
Built seller product and cart flow
Implemented order and quotation management
Built admin dashboard and inventory pages
Added README and deployment guide
```
