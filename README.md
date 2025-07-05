# Just Chill Study

> A modern e-learning platform built with Next.js, Prisma, Supabase, and Tailwind CSS.

## Features

- **User Authentication**: Secure login and registration with NextAuth.js and Supabase.
- **Admin Dashboard**: Manage users, classes, materials, exams, and certificates.
- **Learning Modules**: Organized by classes and materials, with progress tracking.
- **Online Exams**: Take and manage exams with results and reporting.
- **Certificate Generation**: Automatic PDF certificate creation and preview.
- **Payment Integration**: Midtrans integration for subscription and class payments.
- **Responsive UI**: Built with Tailwind CSS and MUI for a seamless experience.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router, TypeScript)
- [Prisma](https://www.prisma.io/) ORM & PostgreSQL
- [Neon](https://neon.com) (Database)
- [Supabase](https://supabase.com/) (Storage)
- [Tailwind CSS](https://tailwindcss.com/)
- [MUI](https://mui.com/) (Material UI)
- [NextAuth.js](https://next-auth.js.org/)
- [Midtrans](https://midtrans.com/) (Payments)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/) (Form Validation)

## Getting Started

### 1. Install dependencies

```bash
pnpm install
# or
yarn install
# or
npm install
```

but i personally use

```bash
pnpm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env` and fill in the required values (database, Supabase, NextAuth, Midtrans, etc).

'.env' example

```bash
# App URL
# NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=

# NextAuth (Google OAuth)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
# NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_URL=

# Neon Database
DATABASE_URL=
DATABASE_URL_UNPOOLED=

PGHOST=
PGHOST_UNPOOLED=
PGUSER=
PGDATABASE=
PGPASSWORD=

POSTGRES_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=
POSTGRES_URL_NO_SSL=
POSTGRES_PRISMA_URL=

# Midtrans Key
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=
MIDTRANS_SERVER_KEY=
MIDTRANS_MERCHANT_ID=

# Supabase Key
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# CRON
CRON_SECRET=

```

### 3. Set up the database

```bash
pnpm prisma migrate dev
pnpm prisma generate
```

### 4. Run the development server

```bash
pnpm dev
# or
yarn dev
# or
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

---

## Project Structure

- `src/app/` — App routes, layouts, and pages
- `src/components/` — UI and form components
- `src/lib/` — Utilities, API, hooks, and configuration
- `prisma/` — Prisma schema and migrations
- `public/` — Static assets
- `types/` — TypeScript type definitions

## Scripts

- `pnpm dev` — Start development server
- `pnpm build` — Build for production
- `pnpm start` — Start production server
- `pnpm lint` — Lint code

## License
