# Supabase Database Setup

Run these SQL commands in your Supabase SQL Editor to create the required tables.

## Tables

### 1. perfumes

```sql
CREATE TABLE perfumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  description TEXT,
  image TEXT,
  inspiration_of TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. notes

```sql
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('top', 'middle', 'base')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. perfume_notes (Junction Table)

```sql
CREATE TABLE perfume_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  perfume_id UUID NOT NULL REFERENCES perfumes(id) ON DELETE CASCADE,
  note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  strength INTEGER DEFAULT 1 CHECK (strength >= 1 AND strength <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(perfume_id, note_id)
);
```

### 4. bottle_sizes

```sql
CREATE TABLE bottle_sizes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  size TEXT NOT NULL UNIQUE,
  price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default bottle sizes
INSERT INTO bottle_sizes (size, price) VALUES
  ('50ml', 89.99),
  ('100ml', 159.99);
```

## Row Level Security (RLS)

Enable RLS and allow read access for now:

```sql
-- Enable RLS on all tables
ALTER TABLE perfumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfume_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bottle_sizes ENABLE ROW LEVEL SECURITY;

-- Create policies for read access (public read)
CREATE POLICY "Allow public read access on perfumes"
  ON perfumes FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on notes"
  ON notes FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on perfume_notes"
  ON perfume_notes FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on bottle_sizes"
  ON bottle_sizes FOR SELECT
  USING (true);
```

## Indexes (for performance)

```sql
-- Create indexes for faster queries
CREATE INDEX idx_perfume_notes_perfume_id ON perfume_notes(perfume_id);
CREATE INDEX idx_perfume_notes_note_id ON perfume_notes(note_id);
CREATE INDEX idx_notes_category ON notes(category);
CREATE INDEX idx_perfumes_brand ON perfumes(brand);
```

