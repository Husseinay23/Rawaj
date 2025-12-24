# Database Setup Guide

## Issue: Database Access Denied

If you're seeing:

```
Error: P1010: User `user` was denied access on the database `rawaj.public`
```

This means your PostgreSQL user doesn't have the necessary permissions.

## Solutions

### Option 1: Grant Permissions (Recommended)

Connect to PostgreSQL as a superuser and grant permissions:

```bash
# Connect to PostgreSQL
psql -U postgres

# Or if using a different superuser:
psql -U your_superuser -d postgres
```

Then run:

```sql
-- Grant all privileges on the database
GRANT ALL PRIVILEGES ON DATABASE rawaj TO "user";

-- Grant privileges on the schema
\c rawaj
GRANT ALL ON SCHEMA public TO "user";
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "user";
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "user";

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "user";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "user";
```

### Option 2: Use a Different User

Update your `.env` file to use a user with proper permissions:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/rawaj?schema=public"
```

Or create a new user:

```sql
-- Create new user
CREATE USER rawaj_user WITH PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE rawaj TO rawaj_user;
\c rawaj
GRANT ALL ON SCHEMA public TO rawaj_user;
```

Then update `.env`:

```env
DATABASE_URL="postgresql://rawaj_user:your_secure_password@localhost:5432/rawaj?schema=public"
```

### Option 3: Create Database if Missing

If the database doesn't exist:

```sql
-- Connect as superuser
psql -U postgres

-- Create database
CREATE DATABASE rawaj;

-- Create user (if needed)
CREATE USER "user" WITH PASSWORD 'your_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE rawaj TO "user";
```

### Option 4: Use Docker PostgreSQL (Easiest for Development)

If you don't have PostgreSQL set up, use Docker:

```bash
# Run PostgreSQL in Docker
docker run --name rawaj-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=rawaj \
  -p 5432:5432 \
  -d postgres:15

# Update .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rawaj?schema=public"
```

## After Fixing Permissions

Run the migration:

```bash
npm run db:push
npm run db:seed
```

## Verify Connection

Test the connection:

```bash
psql $DATABASE_URL -c "SELECT version();"
```

If this works, your connection is configured correctly.
