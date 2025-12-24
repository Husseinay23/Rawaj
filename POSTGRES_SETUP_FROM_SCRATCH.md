# PostgreSQL Setup from Scratch (macOS)

Complete guide to set up PostgreSQL for RAWAJ on macOS.

## Step 1: Install PostgreSQL

### Option A: Using Homebrew (Recommended)

```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15
```

### Option B: Using Postgres.app (GUI)

1. Download from: https://postgresapp.com/
2. Install and launch the app
3. Click "Initialize" to create a new server
4. The default port is 5432

### Option C: Using Docker (Alternative)

```bash
# Install Docker Desktop for Mac if needed
# Then run:
docker run --name rawaj-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=rawaj \
  -p 5432:5432 \
  -d postgres:15

# To start it later:
docker start rawaj-postgres
```

---

## Step 2: Verify Installation

```bash
# Check if PostgreSQL is running
psql --version

# Try connecting (this might fail if no default user exists, that's OK)
psql postgres
```

If you get "role does not exist", continue to Step 3.

---

## Step 3: Create Database and User

### If using Homebrew:

```bash
# Connect to PostgreSQL (Homebrew creates a user with your macOS username)
psql postgres

# Or if that doesn't work, try:
psql -d postgres
```

Once connected, run these SQL commands:

```sql
-- Create a new user for RAWAJ
CREATE USER rawaj_user WITH PASSWORD 'rawaj_password_123';

-- Create the database
CREATE DATABASE rawaj OWNER rawaj_user;

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE rawaj TO rawaj_user;

-- Connect to the new database
\c rawaj

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO rawaj_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO rawaj_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO rawaj_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO rawaj_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO rawaj_user;

-- Exit psql
\q
```

### If using Postgres.app:

1. Open Postgres.app
2. Click "New Database" → Name it `rawaj`
3. The app uses your macOS username as the default user
4. You can use that user or create a new one via the terminal

### If using Docker:

The database and user are already created! Use:

- User: `postgres`
- Password: `postgres`
- Database: `rawaj`

---

## Step 4: Configure Environment Variables

Create or update your `.env` file in the project root:

```bash
# Navigate to project
cd /Users/husseinay/Desktop/work/rawaj

# Create .env file if it doesn't exist
touch .env
```

Add these lines to `.env`:

```env
# Database
DATABASE_URL="postgresql://rawaj_user:rawaj_password_123@localhost:5432/rawaj?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production-min-32-chars"

# Optional: Node environment
NODE_ENV=development
```

**Important:**

- Replace `rawaj_user` and `rawaj_password_123` with the user/password you created
- If using Docker, use: `postgresql://postgres:postgres@localhost:5432/rawaj?schema=public`
- If using your macOS username, use: `postgresql://your_username@localhost:5432/rawaj?schema=public`

---

## Step 5: Test Connection

```bash
# Test the connection (replace with your actual connection string)
psql "postgresql://rawaj_user:rawaj_password_123@localhost:5432/rawaj"

# If it connects successfully, you'll see:
# rawaj=>

# Type \q to exit
```

---

## Step 6: Run Prisma Migrations

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed the database
npm run db:seed
```

---

## Step 7: Verify Everything Works

```bash
# Start the dev server
npm run dev
```

Visit: http://localhost:3000

---

## Troubleshooting

### "role does not exist"

**Solution:** Create the user first:

```sql
CREATE USER your_username WITH PASSWORD 'your_password';
ALTER USER your_username CREATEDB;
```

### "database does not exist"

**Solution:** Create it:

```sql
CREATE DATABASE rawaj;
```

### "permission denied"

**Solution:** Grant privileges:

```sql
GRANT ALL PRIVILEGES ON DATABASE rawaj TO your_username;
\c rawaj
GRANT ALL ON SCHEMA public TO your_username;
```

### "connection refused"

**Solution:** Make sure PostgreSQL is running:

```bash
# Homebrew
brew services start postgresql@15

# Docker
docker start rawaj-postgres

# Check status
brew services list
# or
docker ps
```

### "port 5432 already in use"

**Solution:** Either:

1. Stop the conflicting service
2. Use a different port in DATABASE_URL: `...@localhost:5433/...`

---

## Quick Reference Commands

```bash
# Start PostgreSQL (Homebrew)
brew services start postgresql@15

# Stop PostgreSQL (Homebrew)
brew services stop postgresql@15

# Restart PostgreSQL (Homebrew)
brew services restart postgresql@15

# Connect to database
psql -d rawaj

# List all databases
psql -l

# List all users
psql -c "\du"

# Drop database (if you need to start over)
psql -c "DROP DATABASE rawaj;"

# Drop user (if you need to start over)
psql -c "DROP USER rawaj_user;"
```

---

## Complete Setup Script (Copy & Paste)

If you want to do it all at once:

```bash
# 1. Install PostgreSQL (if using Homebrew)
brew install postgresql@15
brew services start postgresql@15

# 2. Wait a few seconds for PostgreSQL to start, then:
psql postgres << EOF
CREATE USER rawaj_user WITH PASSWORD 'rawaj_password_123';
CREATE DATABASE rawaj OWNER rawaj_user;
GRANT ALL PRIVILEGES ON DATABASE rawaj TO rawaj_user;
\c rawaj
GRANT ALL ON SCHEMA public TO rawaj_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO rawaj_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO rawaj_user;
EOF

# 3. Create .env file
cat > .env << 'ENVEOF'
DATABASE_URL="postgresql://rawaj_user:rawaj_password_123@localhost:5432/rawaj?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="change-this-to-a-random-32-character-string-in-production"
NODE_ENV=development
ENVEOF

# 4. Run Prisma setup
npm run db:generate
npm run db:push
npm run db:seed

# 5. Start dev server
npm run dev
```

---

## Security Note

**For Production:**

- Use strong passwords
- Don't commit `.env` to git
- Use environment variables from your hosting provider
- Consider using connection pooling (e.g., PgBouncer)

---

**That's it!** Your PostgreSQL database should now be set up and ready to use.
