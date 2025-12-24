# Quick Start Guide - PostgreSQL Setup

## 🚀 Fastest Way (Automated Script)

I've created a setup script for you. Just run:

```bash
./setup-database.sh
```

This will:

- ✅ Check if PostgreSQL is running
- ✅ Create database and user
- ✅ Set up all permissions
- ✅ Create `.env` file with correct credentials
- ✅ Generate a secure NEXTAUTH_SECRET

Then run:

```bash
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

---

## 📝 Manual Setup (Step by Step)

### 1. Make sure PostgreSQL is running

```bash
# Check if running
pg_isready

# If not running, start it
brew services start postgresql@15
# or
brew services start postgresql
```

### 2. Create database and user

```bash
psql postgres
```

Then in psql, run:

```sql
-- Create user
CREATE USER rawaj_user WITH PASSWORD 'rawaj_password_123';

-- Create database
CREATE DATABASE rawaj OWNER rawaj_user;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE rawaj TO rawaj_user;

-- Connect to database
\c rawaj

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO rawaj_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO rawaj_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO rawaj_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO rawaj_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO rawaj_user;

-- Exit
\q
```

### 3. Create .env file

```bash
cat > .env << 'EOF'
DATABASE_URL="postgresql://rawaj_user:rawaj_password_123@localhost:5432/rawaj?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-32-character-secret-here"
NODE_ENV=development
EOF
```

### 4. Run Prisma setup

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 5. Start dev server

```bash
npm run dev
```

---

## 🔍 Troubleshooting

### "psql: error: connection to server failed"

**Fix:**

```bash
brew services start postgresql@15
# Wait 3-5 seconds, then try again
```

### "role does not exist"

**Fix:** The script creates the user. If running manually, make sure you created `rawaj_user` first.

### "permission denied"

**Fix:** Make sure you ran all the GRANT commands in Step 2.

### "database does not exist"

**Fix:** Make sure you created the database with `CREATE DATABASE rawaj;`

---

## ✅ Verify Setup

Test the connection:

```bash
psql "postgresql://rawaj_user:rawaj_password_123@localhost:5432/rawaj" -c "SELECT version();"
```

If you see PostgreSQL version info, you're good to go!

---

**Need more help?** See `POSTGRES_SETUP_FROM_SCRATCH.md` for detailed instructions.
