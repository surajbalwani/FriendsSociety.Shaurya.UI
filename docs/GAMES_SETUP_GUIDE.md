# Games Management System - Setup and Troubleshooting Guide

## Setup Steps

### 1. Backend Setup (API)

#### Step 1: Run Database Migration
Open a terminal in the API project directory:

```bash
cd C:\ProjectShaurya\ShauryaAPI\FriendsSociety.Shaurya

# Create the migration
dotnet ef migrations add AddGamesTable

# Apply the migration to database
dotnet ef database update
```

#### Step 2: Verify Database Settings
Check `appsettings.json` to ensure `SeedDemoData` is set to `true`:

```json
{
  "DatabaseSettings": {
    "SeedDemoData": true
  }
}
```

#### Step 3: Run the API
```bash
dotnet run
```

The API should:
- Apply the migration and create the Games table
- Seed 192 games automatically (6 disability types × 4 age categories × 8 games)

#### Step 4: Verify API Endpoint
Test the Games API endpoint:
- Open browser: `http://localhost:5128/api/Games`
- Or use Swagger: `http://localhost:5128/swagger`

You should see the Games controller with these endpoints:
- GET /api/Games
- GET /api/Games/{id}
- GET /api/Games/ByCode/{gameCode}
- GET /api/Games/ByDisabilityType/{disabilityTypeCode}
- GET /api/Games/ByAgeCategory/{ageCategory}
- GET /api/Games/GroupedByDisability
- POST /api/Games
- PUT /api/Games/{id}
- DELETE /api/Games/{id}

### 2. Frontend Setup (Angular)

#### Step 1: Check API URL
Verify `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5128/api'
};
```

#### Step 2: Run Angular Application
```bash
cd C:\ProjectShaurya\ShauryaUI
npm install  # if needed
ng serve
```

#### Step 3: Access Games Management
1. Login to the application
2. Click on "Games Management" in the sidebar menu (🎮 icon)
3. The page should load all games grouped by disability type

## Troubleshooting

### Error: "Failed to load games. Please try again."

#### Possible Causes and Solutions:

**1. API Not Running**
- Solution: Start the API project
- Verify: Open `http://localhost:5128/api/Games` in browser

**2. Database Migration Not Applied**
- Solution: Run migration commands:
  ```bash
  cd C:\ProjectShaurya\ShauryaAPI\FriendsSociety.Shaurya
  dotnet ef database update
  ```

**3. Games Table is Empty**
- Solution: Ensure seeding is enabled in `appsettings.json`
- Restart the API to trigger seeding
- OR manually call seeding:
  ```bash
  # In Program.cs, ensure this section runs:
  # await ModelSeeder.SeedDemoDataAsync(app.Services);
  ```

**4. CORS Error**
- Check browser console for CORS errors
- Solution: Verify `appsettings.json` has correct allowed origins:
  ```json
  {
    "allowedOrigins": "http://localhost:4200,http://localhost:5128"
  }
  ```

**5. API URL Mismatch**
- Check browser Network tab for the exact API call being made
- Should be: `http://localhost:5128/api/Games/GroupedByDisability`
- Verify `environment.ts` has correct `apiUrl`

**6. Authentication Issues**
- Games endpoint requires authentication
- Ensure you're logged in
- Check browser Local Storage for auth token

### Check Browser Console for Detailed Error

Open Browser DevTools (F12) → Console tab:
- Look for red error messages
- Check Network tab for failed API calls
- Response will show exact error message

### Manual Testing via Swagger

1. Go to `http://localhost:5128/swagger`
2. Click "Authorize" button
3. Enter JWT token (get from login)
4. Test `/api/Games/GroupedByDisability` endpoint
5. Should return JSON with games grouped by disability type

### Verify Database Has Games

Connect to your SQL Server database and run:
```sql
SELECT COUNT(*) FROM Games;
-- Should return 192 rows

SELECT * FROM Games WHERE GameCode = '1A02';
-- Should return Bocce game for Physically challenged by leg, Age 8-12

SELECT DISTINCT DisabilityTypeCode FROM Games ORDER BY DisabilityTypeCode;
-- Should return: 1, 2, 3, 4, 5, 6
```

## Game Code Format Reference

### Structure: `[Disability][Age][Game]`

**Disability Codes (1st digit):**
- 1 = Physically challenged by leg
- 2 = Physically challenged by Hand
- 3 = Intellectually challenged
- 4 = DEAF AND DUMB
- 5 = VISUALLY IMPAIRED & PARTIALLY VISUALLY IMPAIRED
- 6 = LEARNING DISABILITY

**Age Categories (2nd character):**
- A = 8 to 12 years
- B = 13 to 17 years
- C = 18 to 22 years
- D = 23 to 27 years

**Game Codes (3rd & 4th digits):**
- 01 = Archery
- 02 = Bocce
- 03 = Carrom
- 04 = Goal The Ball
- 05 = Shotput
- 06 = 50m Race
- 07 = 100m Race
- 08 = 200m Race

### Examples:
- **1A02** = Physically challenged by leg + Age 8-12 + Bocce
- **5B06** = Visually Impaired + Age 13-17 + 50m Race
- **4C04** = Deaf and Dumb + Age 18-22 + Goal The Ball

## Features Implemented

### Backend (API)
✅ Game entity with GameCode system
✅ Games seeded automatically (192 games)
✅ Full CRUD operations
✅ Search by Game Code
✅ Filter by Disability Type
✅ Filter by Age Category
✅ Grouped games view

### Frontend (Angular)
✅ Games Management component
✅ Search by Game Code with decoder
✅ Filter by Disability Type
✅ Visual game cards with codes
✅ Game code legend/reference
✅ Responsive design
✅ Navigation menu integration

## Quick Test Commands

### Test API Endpoints:
```bash
# Get all games grouped
curl http://localhost:5128/api/Games/GroupedByDisability

# Search by game code
curl http://localhost:5128/api/Games/ByCode/1A02

# Get games by disability type
curl http://localhost:5128/api/Games/ByDisabilityType/1
```

## Support
If you continue to have issues:
1. Check all logs in `logs/app-YYYYMMDD.txt`
2. Verify database connection string
3. Ensure all NuGet packages are restored
4. Ensure npm packages are installed
5. Clear browser cache and restart Angular dev server
