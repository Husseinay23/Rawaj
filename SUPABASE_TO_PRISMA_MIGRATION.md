# Supabase → PostgreSQL + Prisma Migration Plan

## 📋 CODEBASE AUDIT - Supabase Usage

### Files to DELETE:
1. **`src/lib/supabaseClient.ts`** - Entire Supabase client file

### Files to MODIFY:
1. **`src/components/perfume/BottleSizeSelector.tsx`**
   - Remove: `import { supabase } from '@/lib/supabaseClient'`
   - Replace: Direct Supabase query with API call to `/api/bottle-sizes`
   - Change: Client-side fetch → API route → Prisma

2. **`src/components/perfume/InspirationSelector.tsx`**
   - Remove: `import { supabase } from '@/lib/supabaseClient'`
   - Replace: Direct Supabase query with API call to `/api/products`
   - Change: Client-side fetch → API route → Prisma

3. **`src/app/api/perfumes/route.ts`**
   - Remove: All Supabase imports and queries
   - Replace: Prisma queries for notes and products
   - Change: Supabase query builder → Prisma ORM

4. **`package.json`**
   - Remove: `@supabase/supabase-js`
   - Add: `prisma`, `@prisma/client`, `bcryptjs`, `@types/bcryptjs`, `next-auth`

5. **Documentation files** (update references):
   - `README.md` - Remove Supabase mentions
   - `AUDIT_AND_PLAN.md` - Update tech stack
   - `IMPLEMENTATION_STATUS.md` - Update backend info

### Environment Variables to REMOVE:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Environment Variables to ADD:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - For NextAuth
- `NEXTAUTH_URL` - App URL

---

## 🗄️ MIGRATION STEPS

### Step 1: Prisma Setup + Schema + Migration
- Install Prisma packages
- Create `prisma/schema.prisma` with provided schema
- Create `.env.example` with DATABASE_URL
- Generate Prisma client
- Create initial migration

### Step 2: Seed Script
- Create `prisma/seed.ts`
- Seed Notes, Products, BottleSizes
- Run seed

### Step 3: Replace Supabase API Routes
- Update `/api/perfumes` → Use Prisma
- Create `/api/products` → Use Prisma
- Create `/api/bottle-sizes` → Use Prisma
- Create `/api/notes` → Use Prisma

### Step 4: Auth Implementation
- Install NextAuth with Prisma adapter
- Create auth API routes
- Update components to use NextAuth

### Step 5: Cart + Orders
- Create cart API routes
- Create order API routes
- Update frontend stores

### Step 6: Frontend Updates
- Update components to use API routes instead of Supabase
- Create cart store with persistence
- Update perfume store for custom perfume creation

---

## ✅ IMPLEMENTATION CHECKLIST

- [ ] Step 1: Prisma setup
- [ ] Step 2: Seed data
- [ ] Step 3: API routes (products, notes, bottle-sizes, recommendations)
- [ ] Step 4: Auth (NextAuth + Prisma)
- [ ] Step 5: Cart + Orders APIs
- [ ] Step 6: Frontend state (cartStore, updated perfumeStore)
- [ ] Step 7: Remove all Supabase files
- [ ] Step 8: Update documentation

