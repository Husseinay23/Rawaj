# Rawaj - Perfume Customization Platform

A Next.js 14 application for building and customizing perfumes with Supabase backend.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
# Fill in your Supabase credentials:
# NEXT_PUBLIC_SUPABASE_URL=your_project_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

- `src/app/` - Next.js App Router pages
- `src/components/` - React components
- `src/lib/` - Utilities and Supabase client
- `src/data/` - Static data files

## Database Setup

See `DATABASE_SETUP.md` for Supabase table creation scripts.

