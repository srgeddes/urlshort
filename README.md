## ShortURL – URL shortener

A small production-ready URL shortener built with:

- Next.js App Router (TypeScript)
- Tailwind CSS
- Prisma ORM
- SQLite in development, PostgreSQL-ready for production

It lets users paste a long URL, generate a random 6-character slug, store it in a database, and redirect from `/slug` to the original URL.

## 1. Installation

1. Install dependencies:

```bash
npm install
```

## 2. Environment variables

Environment variables are defined via `.env` (for Prisma) and `.env.local` (for Next.js). An example is provided in `.env.example`.

Required variables:

- `DATABASE_URL` – connection string for the database  
  - Development (SQLite): e.g. `file:./dev.db`
  - Production (PostgreSQL): e.g. `postgresql://user:password@host:5432/dbname`
- `NEXT_PUBLIC_BASE_URL` – base URL of the app  
  - Development: `http://localhost:3000`
  - Production: your deployed domain, e.g. `https://myshort.app`

Steps:

1. Copy `.env.example` to `.env` and `.env.local` and fill in values:

   ```bash
   cp .env.example .env
   cp .env.example .env.local
   ```

2. Set `DATABASE_URL` to a SQLite file for local development, e.g.:

   ```env
   DATABASE_URL="file:./dev.db"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```

   For production, point `DATABASE_URL` to your PostgreSQL database.

## 3. Database and Prisma

This project uses Prisma ORM with a `ShortUrl` model defined in `prisma/schema.prisma`.

Apply migrations / create the database:

```bash
npm run prisma:migrate
```

Open Prisma Studio (optional):

```bash
npm run prisma:studio
```

## 4. Running the app

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

Build for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## 5. Testing

Basic tests are implemented with Vitest:

- Unit tests for slug generation and URL helpers.
- Integration-style tests for the `/api/shorten` endpoint.
- Integration-style tests for the `/[slug]` redirect route.

Run tests:

```bash
npm test
```

## 6. Deployment notes

- The app is compatible with platforms like Vercel or any Node.js host that supports Next.js.
- Ensure `NEXT_PUBLIC_BASE_URL` is set to your public domain in the deployment environment.
- For production, configure `DATABASE_URL` to point to a PostgreSQL database and run Prisma migrations against it before starting the app.
