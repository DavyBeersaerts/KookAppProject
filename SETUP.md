# MVP Setup Guide (SQLite Version)

This guide will help you set up the MVP version of Rox & Me with local SQLite database.

## Quick Start (5 Minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

The app uses SQLite (a local file-based database). No external database server needed!

```bash
# Generate database schema
npm run db:generate

# Create the database
npm run db:push
```

This creates a `local.db` file in your project root.

### 3. Configure Environment (Optional)

The default configuration works out of the box. If you want to customize:

Create or edit `.env.local`:

```env
# Database path (optional - defaults to ./local.db)
DATABASE_URL=./local.db
```

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 5. Start Using the App

The app uses a demo user by default. You can:
- Add recipes manually
- Plan your weekly meals
- Generate shopping lists
- Manage household settings

## Database Management

### View Database Contents

```bash
npm run db:studio
```

This opens Drizzle Studio in your browser to view and edit data.

### Reset Database

To start fresh, simply delete the database file:

```bash
# Windows
del local.db

# Mac/Linux
rm local.db
```

Then regenerate:

```bash
npm run db:push
```

### Backup Database

Simply copy the `local.db` file:

```bash
# Windows
copy local.db backup.db

# Mac/Linux
cp local.db backup.db
```

## MVP Limitations

This MVP version has the following limitations:

### 🔒 No Authentication
- Uses a demo user (ID: `demo-user-1`)
- No login/logout functionality
- No user registration
- All data is accessible to anyone with access to the app

**Implication**: Not suitable for multi-user or production deployment

### 🤖 No AI Features
- Recipe import from URL uses basic web scraping (no AI extraction)
- Meal planning uses random selection (no smart algorithms)
- Shopping list uses simple aggregation (no optimization)

**Implication**: Limited automation and intelligence

### 💾 Local Database Only
- SQLite file stored locally
- No cloud synchronization
- Single-server deployment only
- Manual backups required

**Implication**: Not scalable for SaaS deployment

## Coming in Beta Release

The next update will include:

### ✨ Authentication System
- Google OAuth login
- Secure user sessions
- Multi-household support
- Role-based access control

**Setup Required**:
- Google Cloud Console project
- OAuth credentials
- NextAuth configuration

### 🤖 AI-Powered Features
- OpenAI GPT-4 for recipe extraction
- Smart meal planning with preferences
- Intelligent shopping list optimization
- Unit normalization

**Setup Required**:
- OpenAI API account
- API key with GPT-4 access
- Credit balance for API usage

### ☁️ Cloud Database
- SQL Server support (SSMS)
- PostgreSQL support (Neon, Supabase)
- Multi-tenant with Row Level Security
- Automated backups

**Setup Required**:
- Cloud database instance
- Connection string
- Migration from SQLite

## Troubleshooting

### Database Errors

**Error**: `SQLITE_CANTOPEN: unable to open database file`

**Solution**: Ensure you have write permissions in the project directory.

```bash
# Check permissions
ls -la local.db

# Fix permissions (Mac/Linux)
chmod 644 local.db
```

### Port Already in Use

**Error**: `Port 3000 is already in use`

**Solution**: Use a different port:

```bash
npm run dev -- -p 3001
```

### Module Not Found

**Error**: `Cannot find module 'better-sqlite3'`

**Solution**: Reinstall dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Database Schema Mismatch

**Error**: `no such table: recipes`

**Solution**: Regenerate the database:

```bash
npm run db:push
```

## Development Tips

### Seed Data

To add sample data for testing, you can use Drizzle Studio:

```bash
npm run db:studio
```

Or create a seed script in `lib/db/seed.ts`.

### Database Migrations

When you change the schema:

```bash
# Generate migration
npm run db:generate

# Apply migration
npm run db:push
```

### Inspect Database

Use any SQLite viewer:
- [DB Browser for SQLite](https://sqlitebrowser.org/) (Desktop app)
- [SQLite Viewer](https://inloop.github.io/sqlite-viewer/) (Web-based)
- Drizzle Studio: `npm run db:studio`

## Production Deployment (Not Recommended for MVP)

⚠️ **Warning**: This MVP is not production-ready for SaaS deployment.

If you still want to deploy for demo purposes:

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Note**: SQLite doesn't work well on serverless platforms. The database will reset on each deployment.

### VPS/Dedicated Server

1. Clone repository
2. Install dependencies: `npm install`
3. Build: `npm run build`
4. Start: `npm start`

**Note**: Still not suitable for multi-user production use without authentication.

## Migration Path to Beta

When beta is released, you can migrate your data:

1. Export data from SQLite
2. Set up cloud database (SQL Server/PostgreSQL)
3. Configure authentication
4. Add OpenAI API key
5. Import data to new database
6. Update environment variables
7. Redeploy

A migration script will be provided with the beta release.

## Support

For issues or questions:
- Check the main README.md
- Review the code comments
- Wait for beta release with full features

## Next Steps

1. ✅ Install dependencies
2. ✅ Set up database
3. ✅ Start development server
4. 📝 Add your first recipe
5. 📅 Plan your first week
6. 🛒 Generate your first shopping list
7. ⏳ Wait for beta release with auth & AI!

---

**Remember**: This is an MVP for development and testing. The beta release will include authentication, AI features, and cloud database support for production deployment.
