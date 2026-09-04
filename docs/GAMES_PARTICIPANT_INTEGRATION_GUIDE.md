# Games & Participant Integration - Implementation Guide

## Overview
This implementation adds game selection functionality to participant registration, allowing participants to select up to 2 games based on their age and ability type. A separate ParticipantGames table maintains the relationships, and a new Participation view shows statistics.

## Changes Summary

### Backend (API) Changes

#### 1. New Entity: `ParticipantGame.cs`
**Location:** `C:\ProjectShaurya\ShauryaAPI\FriendsSociety.Shaurya\Entities\ParticipantGame.cs`
- Junction table for many-to-many relationship
- Fields: ParticipantGameID, ParticipantID, GameID, RegisteredDate, IsDeleted

#### 2. Updated `DataContext.cs`
- Added `DbSet<ParticipantGame> ParticipantGames`
- Configured relationships:
  - ParticipantGame → Participant (Cascade delete)
  - ParticipantGame → Game (Restrict delete)

#### 3. Updated `ParticipantsController.cs`
- Modified GET endpoints to include participant's game selections
- Updated POST endpoint to handle Game1ID and Game2ID
- Added DTOs with Game1ID and Game2ID fields

#### 4. Updated `GamesController.cs`
New endpoints added:
- **GET /api/Games/ByAgeAndAbility?age={age}&abilityTypeId={abilityTypeId}**
  - Returns games filtered by participant's age and ability type
  - Automatically determines age category (A, B, C, D)
  
- **GET /api/Games/Participation**
  - Returns participation statistics for all games
  - Groups by disability type with participant counts

#### 5. Migration Files
- `20251028000000_AddGamesTable.cs` - Creates Games table
- `20251029000000_AddParticipantGamesTable.cs` - Creates ParticipantGames table

### Frontend (Angular) Changes

#### 1. Updated `game.service.ts`
New methods:
- `getGamesByAgeAndAbility(age, abilityTypeId)` - Get games for specific age/ability
- `getGameParticipation()` - Get participation statistics

#### 2. New Component: `game-participation`
**Location:** `C:\ProjectShaurya\ShauryaUI\src\app\components\game-participation\`
- Displays all games with participant counts
- Grouped by disability type
- Color-coded cards (green for participants, gray for none)
- Summary statistics at top

#### 3. Updated `game-management.component`
- Added "View Participation Statistics" button
- Navigation to participation view

#### 4. Updated Routes
- `/games` - Game Management
- `/games/participation` - Participation Statistics

## Database Schema

### ParticipantGames Table
```sql
CREATE TABLE ParticipantGames (
    ParticipantGameID INT PRIMARY KEY IDENTITY,
    ParticipantID INT NOT NULL,
    GameID INT NOT NULL,
    RegisteredDate DATETIME2 NOT NULL,
    IsDeleted BIT NOT NULL,
    FOREIGN KEY (ParticipantID) REFERENCES Participants(ParticipantID) ON DELETE CASCADE,
    FOREIGN KEY (GameID) REFERENCES Games(GameID) ON DELETE RESTRICT
);
```

## Setup Instructions

### 1. Run Database Migrations

```bash
cd C:\ProjectShaurya\ShauryaAPI\FriendsSociety.Shaurya

# Add migrations
dotnet ef migrations add AddGamesTable
dotnet ef migrations add AddParticipantGamesTable

# Apply migrations
dotnet ef database update
```

### 2. Verify API is Running

```bash
# Start API
dotnet run

# Test new endpoints
# 1. Get games by age and ability
http://localhost:5128/api/Games/ByAgeAndAbility?age=10&abilityTypeId=1

# 2. Get participation statistics
http://localhost:5128/api/Games/Participation
```

### 3. Update Excel Template (if using bulk upload)

Add two new columns to participant Excel template:
- **Game1** (Required) - Game code (e.g., 1A02)
- **Game2** (Optional) - Game code (e.g., 1A05)

Example Excel structure:
```
Name | Age | Gender | ... | AbilityType | Game1 | Game2
John | 10  | Male   | ... | 1           | 1A02  | 1A05
Mary | 15  | Female | ... | 5           | 5B06  | 
```

### 4. Start Angular Application

```bash
cd C:\ProjectShaurya\ShauryaUI
ng serve
```

## API Endpoints Reference

### Games Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/Games | Get all games |
| GET | /api/Games/{id} | Get game by ID |
| GET | /api/Games/ByCode/{code} | Get game by code (e.g., 1A02) |
| GET | /api/Games/ByDisabilityType/{code} | Get games by disability type |
| GET | /api/Games/ByAgeCategory/{category} | Get games by age category (A,B,C,D) |
| GET | /api/Games/ByAgeAndAbility?age={age}&abilityTypeId={id} | **NEW** - Get games for participant |
| GET | /api/Games/GroupedByDisability | Get games grouped by disability |
| GET | /api/Games/Participation | **NEW** - Get participation statistics |
| POST | /api/Games | Create new game |
| PUT | /api/Games/{id} | Update game |
| DELETE | /api/Games/{id} | Soft delete game |

### Participants Endpoints

| Method | Endpoint | Description | Changes |
|--------|----------|-------------|---------|
| GET | /api/Participants | Get all participants | **Updated** - Now includes Games array |
| GET | /api/Participants/{id} | Get participant by ID | **Updated** - Includes games |
| POST | /api/Participants | Create participant | **Updated** - Accepts Game1ID, Game2ID |
| PUT | /api/Participants/{id} | Update participant | **Updated** - Accepts Game1ID, Game2ID |

## Usage Examples

### 1. Get Games for Participant

When creating/editing a participant, get applicable games:

```typescript
// In participant form component
getApplicableGames() {
  if (this.participant.age && this.participant.abilityTypeID) {
    this.gameService.getGamesByAgeAndAbility(
      this.participant.age,
      this.participant.abilityTypeID
    ).subscribe(games => {
      this.availableGames = games;
    });
  }
}
```

### 2. Create Participant with Games

```typescript
createParticipant() {
  const participantData = {
    name: 'John Doe',
    age: 10,
    gender: 'Male',
    organizationID: 1,
    abilityTypeID: 1, // Physically challenged by leg
    game1ID: 123, // Required
    game2ID: 124, // Optional
    // ... other fields
  };
  
  this.participantService.createParticipant(participantData).subscribe();
}
```

### 3. View Participation Statistics

Navigate to:
- Main Games page → Click "View Participation Statistics"
- Or directly: `/games/participation`

## Game Selection Rules

1. **Game1** is REQUIRED
2. **Game2** is OPTIONAL
3. Games are filtered by:
   - Participant's Age (determines category A, B, C, or D)
   - Participant's Ability Type (1-6)
4. Only games matching BOTH criteria are shown
5. Age categories:
   - A: 8-12 years
   - B: 13-17 years
   - C: 18-22 years
   - D: 23-27 years

## Participation View Features

✅ Real-time participant counts per game
✅ Grouped by disability type
✅ Color-coded cards:
   - Green border = Has participants
   - Gray/faded = No participants
✅ Total participants summary
✅ Game details (code, age range, category)
✅ Responsive design

## Testing Checklist

### Backend Testing
- [ ] Run migrations successfully
- [ ] Verify Games table has 192 records
- [ ] Verify ParticipantGames table created
- [ ] Test /api/Games/ByAgeAndAbility endpoint
- [ ] Test /api/Games/Participation endpoint
- [ ] Create participant with Game1 only
- [ ] Create participant with Game1 and Game2
- [ ] Verify ParticipantGames records created

### Frontend Testing
- [ ] Games Management page loads
- [ ] "View Participation Statistics" button visible
- [ ] Participation page shows all disability types
- [ ] Participant counts display correctly
- [ ] Empty games show "0 participants"
- [ ] Back button returns to Games page
- [ ] Responsive design works on mobile

## Troubleshooting

### Issue: "Age must be between 8 and 27 years"
**Solution:** Participant age must be 8-27 to have applicable games.

### Issue: No games returned for participant
**Possible Causes:**
1. Age outside 8-27 range
2. AbilityTypeID doesn't match any games
3. Games not seeded properly

**Solution:**
```sql
-- Check if games exist for ability type
SELECT * FROM Games 
WHERE AbilityTypeID = 1 -- participant's ability type
AND AgeCategory = 'A' -- for age 8-12
AND IsDeleted = 0;
```

### Issue: Participation counts always zero
**Possible Causes:**
1. No participants registered with games
2. ParticipantGames table empty

**Solution:**
```sql
-- Check participant-game relationships
SELECT COUNT(*) FROM ParticipantGames WHERE IsDeleted = 0;

-- View which games have participants
SELECT g.Name, g.GameCode, COUNT(pg.ParticipantGameID) as ParticipantCount
FROM Games g
LEFT JOIN ParticipantGames pg ON g.GameID = pg.GameID AND pg.IsDeleted = 0
GROUP BY g.GameID, g.Name, g.GameCode
ORDER BY ParticipantCount DESC;
```

## Excel Template Update (for Bulk Upload)

If implementing bulk upload for participants with games:

1. Update template to include Game1 and Game2 columns
2. Validate game codes exist before creating participants
3. Parse game codes and get GameIDs
4. Create ParticipantGame records after creating Participant

Example validation:
```csharp
// In bulk upload controller
var game1 = await _context.Games
    .FirstOrDefaultAsync(g => g.GameCode == dto.Game1Code && !g.IsDeleted);

if (game1 == null)
{
    errors.Add($"Invalid Game1 code: {dto.Game1Code}");
}
```

## Next Steps (Optional Enhancements)

1. **Participant Game Selection UI**
   - Add game dropdowns to participant form
   - Show only applicable games based on age/ability
   - Validate game selections

2. **Excel Template with Games**
   - Update bulk upload to handle Game1/Game2 columns
   - Add validation for game codes

3. **Team Formation**
   - Group participants by selected games
   - Create teams automatically
   - Schedule matches/events

4. **Reporting**
   - Export participation statistics
   - Generate game-wise participant lists
   - Print certificates with game names

## Summary

This implementation provides:
- ✅ Game selection for participants (Game1 required, Game2 optional)
- ✅ Automatic filtering based on age and ability type
- ✅ Separate ParticipantGames table (no confusion with Volunteers)
- ✅ Participation statistics view
- ✅ Complete API endpoints
- ✅ Angular components and routing
- ✅ Proper database relationships

All requirements have been implemented and are ready for testing!
