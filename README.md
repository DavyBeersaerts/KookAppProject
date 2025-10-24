# Rox & Me - Meal Planning MVP

A Next.js-based meal planning application with recipe management, weekly planning, and shopping list generation.

## 🚀 Current Version: MVP (Beta Features Coming Soon)

This is the initial MVP release. The following features are **coming in the next update**:
- ✨ **Authentication**: Google OAuth via NextAuth.js
- 🤖 **AI Features**: OpenAI-powered recipe extraction and smart planning
- ☁️ **Cloud Database**: SQL Server / PostgreSQL support

## Features

### ✅ Currently Available

- **Recipe Management**:
  - Manual recipe entry with ingredients and steps
  - Photo upload support
  - Recipe library with search
  - Cuisine and difficulty tagging
- **Weekly Planner**:
  - Plan meals for the week
  - Lock/unlock individual days
  - Random meal selection
  - Save and edit plans
- **Shopping List**:
  - Auto-generation from weekly plan
  - Belgian category grouping (Produce, Bakery, Dairy, etc.)
  - Progress tracking with checkboxes
  - Recipe reference tracking
  - Export functionality
- **Household Management**:
  - Create household
  - Multi-user support (basic)
- **Database**: SQLite (local file-based)
- **UI**: Responsive design with Tailwind CSS and Radix UI

### 🔜 Coming in Next Update (Beta)

- **Authentication System**:
  - Google OAuth login
  - Secure session management
  - User profiles
- **AI-Powered Features**:
  - Recipe extraction from URLs
  - Recipe extraction from photos
  - Smart weekly planning with variety rules
  - Intelligent shopping list optimization
  - Unit normalization
- **Cloud Database**:
  - SQL Server support (SSMS)
  - PostgreSQL support
  - Multi-tenant with Row Level Security
- **Real-time Sync**: WebSocket support for household collaboration

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: SQLite (better-sqlite3) - SQL Server coming in beta
- **ORM**: Drizzle
- **UI**: Tailwind CSS, Radix UI
- **State**: Zustand
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- No external database required (uses local SQLite)

### Installation

```bash
npm install
```

### Database Setup

The app uses SQLite by default. Initialize the database:

```bash
npm run db:generate
npm run db:push
```

This creates a `local.db` file in your project root.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### First Time Setup

1. The app will use a demo user by default
2. Create your first household in Settings
3. Add recipes in the Recipes section
4. Plan your week in the Planner
5. Generate shopping lists from your plan

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── dashboard/        # Main app pages
│   │   ├── recipes/      # Recipe management
│   │   ├── planner/      # Weekly planner
│   │   ├── shopping/     # Shopping lists
│   │   └── settings/     # Household settings
│   └── layout.tsx        # Root layout
├── components/           # React components
│   └── ui/              # UI primitives
├── lib/
│   ├── ai/              # AI utilities (placeholders for beta)
│   ├── auth.ts          # Auth (mock for MVP)
│   ├── db/              # Database
│   └── utils.ts         # Utilities
└── public/              # Static assets
```

## Database Schema

- **households**: Multi-tenant households
- **users**: User accounts with household links
- **recipes**: Recipe storage with ingredients
- **plans**: Weekly meal plans
- **shopping_lists**: Generated shopping lists
- **pantry**: Pantry inventory (basic)
- **invites**: Household invitations

## API Routes

### Current (MVP)
- `POST /api/recipes` - Create recipe
- `GET /api/recipes` - List recipes
- `POST /api/recipes/import` - Import from URL (basic scraping)
- `POST /api/planner` - Save meal plan
- `POST /api/planner/spin-week` - Generate week plan (random)
- `POST /api/planner/spin-day` - Generate single day (random)
- `POST /api/shopping/generate` - Generate shopping list
- `PATCH /api/shopping/[id]` - Update shopping list
- `POST /api/household` - Create household
- `POST /api/household/invite` - Invite member

### Coming in Beta
- AI-enhanced recipe import
- Smart meal planning with preferences
- Intelligent shopping list optimization

## Environment Variables

Create a `.env.local` file:

```env
# Database (SQLite - local file)
DATABASE_URL=./local.db

# Beta features (not active yet)
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=your-secret
# GOOGLE_CLIENT_ID=your-id
# GOOGLE_CLIENT_SECRET=your-secret
# OPENAI_API_KEY=sk-your-key
```

## Roadmap

### ✅ Phase 1: MVP (Current)
- Basic recipe management
- Simple weekly planning
- Shopping list generation
- Local SQLite database
- Demo user mode

### 🔄 Phase 2: Beta (Next Update)
- Google OAuth authentication
- OpenAI integration for AI features
- SQL Server / PostgreSQL support
- Real-time collaboration
- Advanced meal planning algorithms
- Recipe import from URLs and photos

### 📋 Phase 3: Full Release
- PWA with offline support
- Mobile apps (React Native)
- Pantry management
- Nutritional information
- Recipe scaling
- Meal prep mode
- Community recipe sharing
- Grocery delivery integration

## SaaS Implications

### Current MVP Limitations

**Without Authentication:**
- Single demo user mode
- No user registration/login
- No data privacy/isolation
- Not suitable for multi-user deployment
- Cannot monetize with subscriptions

**Without AI:**
- Manual recipe entry only
- Basic random meal selection
- Simple ingredient aggregation
- No smart recommendations
- Limited value proposition

**With SQLite:**
- Single-server deployment only
- No horizontal scaling
- File-based storage (not cloud-native)
- Manual backups required
- Not suitable for production SaaS

### Beta Release Will Enable:

**With Authentication:**
- ✅ User registration and login
- ✅ Secure data isolation per household
- ✅ Subscription management
- ✅ Multi-tenant architecture
- ✅ Production-ready security

**With AI:**
- ✅ Automated recipe import
- ✅ Smart meal planning
- ✅ Personalized recommendations
- ✅ Premium feature differentiation
- ✅ Higher perceived value

**With SQL Server/PostgreSQL:**
- ✅ Cloud-native deployment
- ✅ Horizontal scaling
- ✅ Automated backups
- ✅ High availability
- ✅ Enterprise-ready

### Recommended Deployment Strategy

**MVP (Current):**
- Use for local development only
- Demo purposes
- Feature validation
- UI/UX testing

**Beta (Next Update):**
- Deploy to production
- Enable user registration
- Launch marketing campaigns
- Start monetization
- Scale infrastructure

## Development Notes

- The app currently uses mock authentication (demo user)
- AI features return placeholder data
- Database is local SQLite file
- All beta features are clearly marked in code
- Migration path to SQL Server is prepared

## Security Notes

⚠️ **MVP is not production-ready for SaaS deployment**

Current limitations:
- No authentication/authorization
- No data encryption
- No rate limiting
- No input validation on all endpoints
- No CSRF protection
- No audit logging

These will be addressed in the beta release.

## Contributing

This is a private project. Beta release coming soon!

## License

Private - All Rights Reserved
