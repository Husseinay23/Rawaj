# RAWAJ - Comprehensive Audit & Implementation Plan

## Executive Summary

**Project:** RAWAJ - Luxury Custom Perfumery E-commerce Platform  
**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion, GSAP, Zustand, Supabase  
**Status:** Foundation exists, core features missing, animations need optimization

---

## 1. CURRENT CODEBASE AUDIT

### 1.1 Existing Pages & Routes

✅ **Implemented:**

- `/` - Home/Landing page (SplitHero + BottlesSection)
- `/build` - Basic perfume builder (bottle size + inspiration selector)
- `/notes` - Placeholder page (empty)
- `/about` - Placeholder page (empty)

❌ **Missing:**

- `/shop` - Ready-made perfumes catalog
- `/shop/[id]` - Product details page
- `/cart` - Shopping cart
- `/checkout` - Checkout flow
- `/checkout/confirmation` - Order confirmation
- `/account` - User account dashboard
- `/account/orders` - Order history
- `/admin` - Admin dashboard
- `/admin/inventory` - Inventory management
- `/admin/orders` - Order management
- `/craft` - Our Craft / Ingredients page
- `/contact` - Contact page

### 1.2 Existing Components

**Hero & Sections:**

- `SplitHero.tsx` - Hero with floating bottle animation
- `BottlesSection.tsx` - Scroll-triggered bottle showcase
- `ScrollVideoHero.tsx` - Video hero (not used on main page)

**Perfume Builder:**

- `BottleSizeSelector.tsx` - Size selection (50ml/100ml)
- `InspirationSelector.tsx` - Perfume inspiration dropdown
- `BottlePreview.tsx` - Basic bottle preview
- `PriceDisplay.tsx` - Price calculator

**UI:**

- `Navbar.tsx` - Navigation with theme toggle
- `Footer.tsx` - Footer component

**Missing Components:**

- Notes selector (top/middle/base)
- Gender profile selector
- Recommendation engine UI
- Perfume naming component
- Cart components
- Checkout form
- Product card
- Product gallery
- Order summary
- User account components
- Admin components

### 1.3 State Management

**Current:**

- Zustand store (`perfumeStore.ts`) - Basic perfume builder state
  - `selectedBottleSize`
  - `selectedPerfume`
  - `estimatedPrice`

**Missing:**

- Cart store
- User/auth store
- Order store
- Admin store

### 1.4 Backend & Data

**Current:**

- Supabase client configured
- API route: `/api/perfumes` (POST - note matching)
- Database tables (inferred):
  - `perfumes`
  - `notes`
  - `perfume_notes` (junction)
  - `bottle_sizes`

**Missing:**

- Orders table
- Users table
- Cart items table
- Order items table
- Custom perfume configurations table
- API endpoints for:
  - Cart operations
  - Checkout
  - Order management
  - User authentication
  - Admin operations

### 1.5 Animation & Performance Issues

**Identified Problems:**

1. **Landing Page Twitchiness:**

   - Multiple animation libraries (Framer Motion + GSAP) can conflict
   - Infinite animation loop in `SplitHero` (y: [0, -15, 0]) may cause reflows
   - Background images with `background-attachment: fixed` cause performance issues on mobile
   - Multiple `useInView` hooks in `BottlesSection` trigger simultaneously
   - ScrollTrigger animations in `/build` may conflict with page scroll

2. **Performance Concerns:**

   - No image optimization (using `<img>` instead of Next.js `Image`)
   - No lazy loading strategy
   - GSAP ScrollTrigger not properly cleaned up in all cases
   - Background images loaded on every page

3. **Animation Best Practices:**
   - Three.js not integrated (mentioned in requirements)
   - No GPU-accelerated animations
   - No animation performance monitoring

---

## 2. MISSING FEATURES ANALYSIS

### 2.1 Core Custom Perfume Creation Flow

**Current State:** Only Step 1 (Bottle Size) and partial Step 2 (Inspiration) exist.

**Required 6-Step Flow:**

1. ✅ **Step 1 - Bottle Size** (50ml/100ml) - EXISTS
2. ⚠️ **Step 2 - Gender Profile** (Masculine/Feminine/Mixed) - MISSING
3. ❌ **Step 3 - Choose Notes** (Top/Middle/Base) - MISSING
4. ❌ **Step 4 - Recommendation Engine** - MISSING
5. ❌ **Step 5 - Name Your Perfume** - MISSING
6. ❌ **Step 6 - Add to Cart** - MISSING

### 2.2 E-commerce Essentials

**Missing:**

- Product catalog (ready-made perfumes)
- Product detail pages with:
  - Image gallery
  - Scent pyramid visualization
  - Reviews/ratings
  - Related products
- Shopping cart functionality
- Checkout process:
  - Shipping address
  - Payment integration
  - Order summary
- Order management:
  - Order history
  - Order tracking
  - Order details

### 2.3 User Experience

**Missing:**

- User authentication
- User profiles
- Saved addresses
- Wishlist
- Order history
- Account settings

### 2.4 Content Pages

**Missing:**

- About the Brand (timeline, story)
- Our Craft / Ingredients (detailed ingredient showcase)
- Contact page (form + map)

### 2.5 Admin Functionality

**Missing:**

- Admin dashboard
- Inventory management
- Order management
- Product CRUD
- Analytics

---

## 3. DATA MODELS PROPOSAL

### 3.1 Database Schema

```sql
-- Users (Supabase Auth handles this, but we need profiles)
profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Products (Ready-made perfumes)
products (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  description TEXT,
  price DECIMAL(10,2),
  image_url TEXT,
  stock_quantity INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Notes
notes (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT CHECK (category IN ('top', 'middle', 'base')),
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP
)

-- Product Notes (Junction)
product_notes (
  product_id UUID REFERENCES products(id),
  note_id UUID REFERENCES notes(id),
  strength INTEGER DEFAULT 1, -- 1-5
  PRIMARY KEY (product_id, note_id)
)

-- Bottle Sizes
bottle_sizes (
  id UUID PRIMARY KEY,
  size TEXT NOT NULL UNIQUE, -- '50ml', '100ml'
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP
)

-- Custom Perfume Configurations
custom_perfumes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  name TEXT, -- User-given name
  bottle_size_id UUID REFERENCES bottle_sizes(id),
  gender_profile TEXT CHECK (gender_profile IN ('masculine', 'feminine', 'mixed')),
  top_notes JSONB, -- Array of note IDs with percentages
  middle_notes JSONB,
  base_notes JSONB,
  inspiration_product_id UUID REFERENCES products(id),
  price DECIMAL(10,2),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Cart Items
cart_items (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  session_id TEXT, -- For guest carts
  product_id UUID REFERENCES products(id),
  custom_perfume_id UUID REFERENCES custom_perfumes(id),
  quantity INTEGER DEFAULT 1,
  price DECIMAL(10,2), -- Snapshot at time of add
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Orders
orders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  order_number TEXT UNIQUE,
  status TEXT CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal DECIMAL(10,2),
  shipping DECIMAL(10,2),
  tax DECIMAL(10,2),
  total DECIMAL(10,2),
  shipping_address JSONB,
  billing_address JSONB,
  payment_method TEXT,
  payment_status TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Order Items
order_items (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  custom_perfume_id UUID REFERENCES custom_perfumes(id),
  quantity INTEGER,
  price DECIMAL(10,2),
  created_at TIMESTAMP
)
```

### 3.2 TypeScript Interfaces

```typescript
// src/types/index.ts

export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  image_url?: string;
  stock_quantity: number;
  is_active: boolean;
  notes?: Note[];
}

export interface Note {
  id: string;
  name: string;
  category: "top" | "middle" | "base";
  description?: string;
  image_url?: string;
}

export interface CustomPerfume {
  id: string;
  name?: string;
  bottle_size_id: string;
  gender_profile: "masculine" | "feminine" | "mixed";
  top_notes: NoteSelection[];
  middle_notes: NoteSelection[];
  base_notes: NoteSelection[];
  inspiration_product_id?: string;
  price: number;
}

export interface NoteSelection {
  note_id: string;
  percentage: number; // 0-100
}

export interface CartItem {
  id: string;
  product_id?: string;
  custom_perfume_id?: string;
  quantity: number;
  price: number;
  product?: Product;
  custom_perfume?: CustomPerfume;
}

export interface Order {
  id: string;
  order_number: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shipping_address: Address;
  billing_address: Address;
  items: OrderItem[];
  created_at: string;
}

export interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
}
```

---

## 4. API ENDPOINTS PROPOSAL

### 4.1 Products

- `GET /api/products` - List all products
- `GET /api/products/[id]` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### 4.2 Notes

- `GET /api/notes` - List all notes
- `GET /api/notes/[id]` - Get note details
- `GET /api/notes?category=top` - Filter by category

### 4.3 Custom Perfumes

- `POST /api/custom-perfumes` - Create custom perfume config
- `GET /api/custom-perfumes/[id]` - Get custom perfume
- `PUT /api/custom-perfumes/[id]` - Update custom perfume

### 4.4 Recommendations

- `POST /api/recommendations` - Get perfume recommendations based on notes
- `POST /api/recommendations/auto-blend` - Auto-generate blend from notes

### 4.5 Cart

- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/[id]` - Update cart item quantity
- `DELETE /api/cart/[id]` - Remove cart item
- `DELETE /api/cart` - Clear cart

### 4.6 Orders

- `POST /api/orders` - Create order
- `GET /api/orders` - List user orders
- `GET /api/orders/[id]` - Get order details
- `PUT /api/orders/[id]` - Update order status (admin)

### 4.7 Auth (Supabase handles, but we need helpers)

- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

---

## 5. UX & INTERACTION DESIGN

### 5.1 Custom Perfume Creation Flow

**Step 1: Bottle Size Selection**

- Visual bottle representation (3D or high-quality image)
- Size options: 50ml / 100ml
- Price display
- Smooth transition to next step

**Step 2: Gender Profile**

- Three options: Masculine / Feminine / Mixed
- Visual mood change (colors, lighting)
- Affects available notes & recommendations
- Animated transition

**Step 3: Choose Notes**

- Three sections: Top / Middle / Base
- Notes as floating cards/orbs (Three.js)
- Interactive hover effects
- Drag-to-select (optional)
- Visual feedback on selection
- Progress indicator

**Step 4: Recommendation Engine**

- Show matching perfume profiles
- Auto-generated blend option
- Manual fine-tuning slider
- Visual scent pyramid
- Preview composition

**Step 5: Name Your Perfume**

- Text input with validation
- Optional engraving preview on bottle
- Character limit
- Real-time preview

**Step 6: Add to Cart**

- Price summary
- Configuration summary
- Animated transition to cart
- Success feedback

### 5.2 Shop Page

- Grid/list view toggle
- Filter by:
  - Gender profile
  - Price range
  - Notes (top/middle/base)
- Sort by: Price, Name, Popularity
- Infinite scroll or pagination
- Product cards with hover effects

### 5.3 Product Details

- Image gallery with zoom
- Scent pyramid visualization
- Note descriptions
- Add to cart CTA
- Related products
- Reviews section (future)

### 5.4 Cart

- Item list with quantities
- Remove items
- Update quantities
- Price breakdown
- Proceed to checkout CTA

### 5.5 Checkout

- Multi-step form:
  1. Shipping address
  2. Payment method
  3. Review & confirm
- Progress indicator
- Order summary sidebar
- Form validation
- Error handling

---

## 6. THREE.JS INTEGRATION PLAN

### 6.1 Use Cases

1. **Floating Notes Selection**

   - Notes as 3D orbs/cards
   - Hover interactions
   - Selection animations
   - Particle effects on selection

2. **Bottle 3D Preview**

   - Rotatable bottle model
   - Lighting effects
   - Label preview
   - Size visualization

3. **Scent Pyramid Visualization**

   - 3D pyramid showing note layers
   - Interactive exploration
   - Color-coded by note category

4. **Background Particles**
   - Subtle particle effects on hero
   - Performance-optimized
   - Theme-aware colors

### 6.2 Implementation Strategy

- Use `@react-three/fiber` and `@react-three/drei` for React integration
- Lazy load Three.js components
- Use `useFrame` for animations (60fps target)
- Implement level-of-detail (LOD) for complex scenes
- Fallback to 2D for mobile devices

---

## 7. PERFORMANCE OPTIMIZATION PLAN

### 7.1 Animation Fixes

1. **Unify Animation Library**

   - Prefer Framer Motion for most UI animations
   - Use GSAP only for complex scroll-triggered animations
   - Avoid conflicts by not animating same elements with both

2. **Fix Landing Page Twitchiness**

   - Remove `background-attachment: fixed` (use CSS transforms instead)
   - Optimize infinite animations (use `will-change` CSS property)
   - Debounce scroll events
   - Use `requestAnimationFrame` for scroll-linked animations

3. **Optimize ScrollTrigger**
   - Clean up all ScrollTrigger instances on unmount
   - Use `once: true` for one-time animations
   - Reduce number of active triggers

### 7.2 Image Optimization

- Replace all `<img>` with Next.js `Image` component
- Implement lazy loading
- Use WebP format with fallbacks
- Responsive images with `srcset`

### 7.3 Code Splitting

- Lazy load Three.js components
- Code split routes
- Dynamic imports for heavy components

### 7.4 State Management

- Optimize Zustand stores (avoid unnecessary re-renders)
- Use selectors for derived state
- Implement persistence for cart

---

## 8. IMPLEMENTATION ROADMAP

### Phase 1: Fix & Optimize (Week 1)

1. Fix landing page animation issues
2. Optimize performance
3. Implement proper image optimization
4. Clean up animation conflicts

### Phase 2: Complete Perfume Builder (Week 2)

1. Add gender profile selection
2. Implement notes selector with Three.js
3. Build recommendation engine
4. Add perfume naming
5. Complete add-to-cart flow

### Phase 3: E-commerce Core (Week 3)

1. Create shop page
2. Build product details page
3. Implement cart functionality
4. Build checkout flow
5. Create order confirmation

### Phase 4: Backend & Data (Week 4)

1. Design database schema
2. Create API endpoints
3. Implement authentication
4. Build admin dashboard basics

### Phase 5: Content & Polish (Week 5)

1. Complete About page
2. Build Our Craft page
3. Create Contact page
4. Add user account pages
5. Final UX polish

---

## 9. TECHNICAL DECISIONS

### 9.1 Animation Library Strategy

- **Primary:** Framer Motion (simpler, React-friendly)
- **Secondary:** GSAP (complex scroll animations only)
- **3D:** Three.js via React Three Fiber

### 9.2 State Management

- **Global:** Zustand (lightweight, performant)
- **Server:** Supabase (database + auth)
- **Form:** React Hook Form (validation)

### 9.3 Payment Integration

- **Recommended:** Stripe (most common, well-documented)
- **Alternative:** PayPal, Square

### 9.4 Deployment

- **Recommended:** Vercel (Next.js optimized)
- **Alternative:** Netlify, AWS

---

## 10. SUCCESS METRICS

- **Performance:**

  - Lighthouse score > 90
  - First Contentful Paint < 1.5s
  - Time to Interactive < 3s
  - No animation jank

- **UX:**

  - Smooth 60fps animations
  - Intuitive perfume creation flow
  - Fast page transitions
  - Mobile-responsive

- **Functionality:**
  - Complete 6-step perfume builder
  - Full e-commerce flow
  - Admin capabilities
  - User accounts

---

## NEXT STEPS

1. Review and approve this plan
2. Start with Phase 1 (fixes & optimization)
3. Iterate on implementation
4. Test thoroughly
5. Deploy incrementally

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Author:** Senior Full-Stack Engineer & Creative Technologist
