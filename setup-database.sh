#!/bin/bash

# RAWAJ Database Setup Script
# This script sets up PostgreSQL database from scratch

set -e  # Exit on error

echo "🚀 Setting up RAWAJ database..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo -e "${YELLOW}⚠️  PostgreSQL doesn't seem to be running.${NC}"
    echo "Starting PostgreSQL..."
    brew services start postgresql@15 || brew services start postgresql
    sleep 3
fi

# Get current username
CURRENT_USER=$(whoami)
echo -e "${GREEN}✓${NC} Using PostgreSQL with user: $CURRENT_USER"

# Database credentials
DB_NAME="rawaj"
DB_USER="rawaj_user"
DB_PASSWORD="rawaj_password_123"

echo ""
echo "Creating database and user..."

# Create user and database
psql postgres << EOF
-- Drop if exists (for clean setup)
DROP DATABASE IF EXISTS $DB_NAME;
DROP USER IF EXISTS $DB_USER;

-- Create user
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';

-- Create database
CREATE DATABASE $DB_NAME OWNER $DB_USER;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
EOF

echo -e "${GREEN}✓${NC} Database and user created"

# Grant schema privileges
echo "Setting up schema privileges..."
psql -d $DB_NAME << EOF
GRANT ALL ON SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;
EOF

echo -e "${GREEN}✓${NC} Schema privileges granted"

# Create .env file
echo ""
echo "Creating .env file..."
cat > .env << ENVEOF
# Database
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"

# Optional
NODE_ENV=development
ENVEOF

echo -e "${GREEN}✓${NC} .env file created"

echo ""
echo -e "${GREEN}✅ Database setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Run: npm run db:generate"
echo "  2. Run: npm run db:push"
echo "  3. Run: npm run db:seed"
echo "  4. Run: npm run dev"
echo ""

