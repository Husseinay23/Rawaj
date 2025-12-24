# Inspiration-Based Search System

## Overview

RAWAJ implements a sophisticated inspiration-based search system that allows users to search for famous perfumes (e.g., "Dior Sauvage") and discover matching RAWAJ products, without displaying or selling external brands.

## Core Concept

- **RAWAJ Products**: The ONLY sellable items on the platform
- **Inspirations**: Internal reference dataset of famous perfumes (NOT products)
- **Matching**: Products are linked to inspirations via similarity scores
- **UX**: Subtle, elegant, legally safe - no "dupe" language

---

## Data Architecture

### Inspiration Model

```prisma
model Inspiration {
  id              String   @id
  displayName     String   // "Dior Sauvage"
  searchableAliases Json   // ["sauvage", "dior sauvage"]
  genderProfile   GenderProfile
  topNotes        Json     // ["Bergamot", "Pepper"]
  middleNotes     Json     // ["Lavender", "Pink Pepper"]
  baseNotes       Json     // ["Ambroxan", "Cedar"]
  mainAccords     Json     // ["fresh", "spicy", "woody"]
  moodTags        Json     // ["confident", "bold"]
  intensity       Int      // 1-5 scale
}
```

### Product-Inspiration Link

```prisma
model ProductInspiration {
  productId       String
  inspirationId   String
  similarityScore Float   // 0.0 - 1.0
}
```

### Product Updates

- Added `slug` field for URL-friendly identifiers
- Products can reference multiple inspirations
- Similarity scores determine match quality

---

## Search Flow

### 1. User Searches
User types: "Dior Sauvage" or "sauvage"

### 2. Search API (`/api/search`)
- Searches RAWAJ products by name
- Searches inspirations by `displayName` and `searchableAliases`
- If inspiration match found:
  - Returns linked RAWAJ products
  - Sets `hasInspirationMatch: true`

### 3. Frontend Display
- Shows matching RAWAJ products
- Displays subtle message: *"Showing fragrances inspired by the style you're looking for"*
- **Never shows external brand names**

---

## API Endpoints

### Global Search
```
GET /api/search?q=dior%20sauvage
```
Returns:
- `products`: Matching RAWAJ products
- `inspirations`: Matched inspirations (internal use)
- `hasInspirationMatch`: Boolean flag

### Product Filter
```
GET /api/products/filter?gender=MASCULINE&mood=confident
```
Supports:
- `gender`: MASCULINE | FEMININE | MIXED
- `noteCategory`: TOP | MIDDLE | BASE
- `noteId`: Filter by specific note
- `mood`: Filter by mood tag
- `intensity`: Filter by intensity (1-5)
- `minPrice` / `maxPrice`: Price range
- `search`: Text search

### Product Detail
```
GET /api/products/[slug]
```
Returns:
- Product details
- Scent pyramid
- Linked inspirations (internal)
- Similar products

---

## Recommendation Engine

### Shared Logic
The recommendation engine (`/api/perfumes` POST) uses:
1. **Note Matching**: Products with shared notes
2. **Inspiration Matching**: Products linked to same inspirations
3. **Similarity Scoring**: Weighted algorithm

### Usage
- **Builder**: Recommends products based on selected notes
- **PDP**: Shows similar products
- **Search**: Matches inspirations to products

---

## Frontend Pages

### `/shop` - Shop Page
- Product grid with search
- Filters: gender, notes, mood, intensity
- Inspiration search support
- Responsive design

### `/shop/[slug]` - Product Detail Page
- Full product information
- Size selection (50ml / 100ml)
- Scent pyramid visualization
- Similar products
- Add to cart

---

## UX Guidelines

### Legal Safety
✅ **DO:**
- Use neutral language: "inspired by the style"
- Focus on RAWAJ products only
- Emphasize quality and craftsmanship

❌ **DON'T:**
- Use "dupe" or "copy" language
- Display external brand names to users
- Make direct comparisons

### Subtle Messaging
- "Showing fragrances inspired by the style you're looking for"
- "This fragrance captures a style reminiscent of classic luxury perfumery"
- "You may also like" (for similar products)

---

## Seed Data

### Example Inspirations
1. **Dior Sauvage**
   - Gender: Masculine
   - Accords: fresh, spicy, woody
   - Mood: confident, bold

2. **Bleu de Chanel**
   - Gender: Masculine
   - Accords: woody, fresh, aromatic
   - Mood: sophisticated, elegant

3. **Chanel No. 5**
   - Gender: Feminine
   - Accords: floral, aldehydic, powdery
   - Mood: timeless, classic

4. **Tom Ford Black Orchid**
   - Gender: Mixed
   - Accords: oriental, floral, woody
   - Mood: luxurious, sensual

### Product-Inspiration Links
- Classic Elegance ↔ Chanel No. 5 (0.75 similarity)
- Modern Fresh ↔ Bleu de Chanel (0.70 similarity)
- Oriental Spice ↔ Tom Ford Black Orchid (0.80 similarity)

---

## Implementation Checklist

- [x] Inspiration model in Prisma
- [x] Product-Inspiration junction table
- [x] Search API with inspiration matching
- [x] Filter API with mood/intensity support
- [x] Product slug field
- [x] Seed data for inspirations
- [x] Shop page with search
- [x] Product detail page
- [x] Recommendation engine updates
- [x] Navbar shop link

---

## Next Steps

### Enhancements
1. **More Inspirations**: Add 20-30 more famous perfumes
2. **Similarity Algorithm**: Improve scoring based on notes + accords
3. **Analytics**: Track popular searches
4. **A/B Testing**: Test different UX copy
5. **Admin Panel**: Manage inspirations and links

### Performance
- Cache inspiration data
- Optimize search queries
- Add search result pagination

---

## Database Migration

After updating the schema:

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

This will:
1. Add `slug` to existing products
2. Create `Inspiration` table
3. Create `ProductInspiration` junction table
4. Seed sample inspirations
5. Link products to inspirations

---

**Status**: ✅ Complete  
**Last Updated**: 2024

