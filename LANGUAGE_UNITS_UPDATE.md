# Language and Units Update

## Changes Made

### 1. Language Support
- Added language setting to household settings (English/Dutch)
- Language can be changed in Settings page
- Default language is English
- Settings are saved per household

### 2. Metric Units
- Replaced free-text unit input with dropdown
- Fixed metric units only:
  - gram (g), kilogram (kg)
  - milliliter (ml), liter (l)
  - theelepel (tsp), eetlepel (tbsp)
  - kop (cup), stuk (piece)
  - snufje (pinch), handvol (handful)
  - plak (slice), teen (clove)
  - bosje (bunch), blik (can), pakje (package)

### 3. Ingredients Database
- Created `ingredients` table to store unique ingredients per household
- Ingredients are automatically saved when creating recipes
- Prevents duplicate ingredients (case-insensitive matching)
- Links recipes to ingredients via `ingredientId`
- Stores default unit for each ingredient

### 4. Database Schema Updates
- Added `language` field to household settings
- Added `ingredients` table with:
  - id, householdId, name, category, defaultUnit, createdAt
- Added `ingredientId` to recipe ingredients
- Updated relations

### 5. UI Components
- Created Select component for dropdowns
- Updated RecipeForm to use Select for units
- Updated HouseholdSettings to include language selection
- Added Globe icon for language settings

### 6. API Updates
- Updated `/api/recipes` POST to save ingredients
- Added `/api/household` PATCH to update settings
- Ingredients are deduplicated and linked automatically

## Files Modified
- `lib/db/schema.ts` - Added ingredients table and language setting
- `lib/constants.ts` - Created with metric units and translations
- `components/ui/select.tsx` - New Select component
- `components/recipe-form.tsx` - Updated to use Select for units
- `components/household-settings.tsx` - Added language selection
- `app/api/recipes/route.ts` - Added ingredient saving logic
- `app/api/household/route.ts` - Added PATCH endpoint
- `lib/db/index.ts` - Updated seed data with language

## Database Migration
- Generated migration: `drizzle/0001_lush_nitro.sql`
- Applied with `npm run db:push`

## Next Steps
- Implement translations throughout the app using the language setting
- Add ingredient autocomplete in recipe form
- Add ingredient management page
- Consider adding ingredient categories
