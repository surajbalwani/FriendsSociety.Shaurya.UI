# Shaurya Project - Complete Setup Guide

## 🎯 Overview

This guide will help you set up and run the complete Shaurya Activity Management System, which consists of:
1. **Backend API** - ASP.NET Core 8 Web API
2. **Frontend UI** - Angular 18 Application

---

## 📋 Prerequisites

### Required Software
- **Node.js** v18 or higher - [Download](https://nodejs.org/)
- **Angular CLI** v18 - Install: `npm install -g @angular/cli`
- **.NET 8 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
- **SQL Server** (LocalDB or Express) - [Download](https://www.microsoft.com/sql-server/sql-server-downloads)
- **Visual Studio 2022** or **VS Code** (recommended)

### Verify Installations
```bash
node --version        # Should show v18.x.x or higher
npm --version         # Should show 9.x.x or higher
ng version           # Should show Angular CLI 18.x.x
dotnet --version     # Should show 8.0.x
```

---

## 🔧 Backend API Setup

### Step 1: Navigate to API Project
```bash
cd C:\ProjectShaurya\ShauryaAPI\FriendsSociety.Shaurya
```

### Step 2: Update Database Connection String
Edit `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=ShauryaDB;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

### Step 3: Restore NuGet Packages
```bash
dotnet restore
```

### Step 4: Create Database
```bash
dotnet ef database update
```

This will:
- Create the `ShauryaDB` database
- Run all migrations
- Create all tables (Users, Roles, Activities, etc.)

### Step 5: Run the API
```bash
dotnet run
```

Or press F5 in Visual Studio

The API will start on: **https://localhost:7000** (or check console output)

### Step 6: Verify API is Running
Open browser and go to: `https://localhost:7000/swagger`

You should see the Swagger documentation with all endpoints.

---

## 🎨 Frontend UI Setup

### Step 1: Navigate to UI Project
```bash
cd C:\ProjectShaurya\ShauryaUI
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all required packages (Angular, RxJS, etc.)

### Step 3: Verify API URL
Check `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7000/api'  // Must match your API URL
};
```

### Step 4: Start the Application
```bash
npm start
```

Or:
```bash
ng serve
```

The application will start on: **http://localhost:4200**

### Step 5: Open in Browser
Navigate to: `http://localhost:4200`

You should see the Shaurya dashboard!

---

## 🎬 First Time Usage

### 1. Add Base Data (Recommended Order)

#### Step 1: Add Roles
- Navigate to **Roles** page
- Add roles: `Admin`, `Organizer`, `Participant`

#### Step 2: Add Organizations
- Navigate to **Organizations** page
- Add organizations like: `ABC School`, `XYZ Sports Club`

#### Step 3: Add Ability Types
- Navigate to **Ability Types** page
- Add types like:
  - `Visually Impaired`
  - `Hearing Impaired`
  - `Mobility Impaired`
  - `Neurological`
  - `General`

#### Step 4: Add Activities
- Navigate to **Activities** page
- Add activities like: `Cricket`, `Football`, `Swimming`, `Chess`

#### Step 5: Add Grounds
- Navigate to **Grounds** page
- Add grounds like: `Main Stadium`, `Practice Ground`, `Indoor Hall`

#### Step 6: Link Activities with Ability Types
- Navigate to **Activity Categories** page
- Link each activity with compatible ability types
- Example: Cricket → Visually Impaired (Modified Rules)

#### Step 7: Add Users
- Navigate to **Users** page
- Create users with their role, ability type, and organization

#### Step 8: Schedule Events
- Navigate to **Ground Allocations** page
- Schedule activities on grounds
- System will prevent conflicts automatically!

---

## 🔍 Testing the System

### Test CRUD Operations
1. **Create** - Add new records
2. **Read** - View all records in tables
3. **Update** - Edit existing records
4. **Delete** - Delete records (soft delete for users, activities, etc.)

### Test Business Logic

#### Test 1: Conflict Detection
1. Go to Ground Allocations
2. Schedule an activity (e.g., Cricket at Ground 1, 2 PM - 4 PM)
3. Try to schedule another activity at the same ground with overlapping time
4. ✅ System should show an error: "Ground already allocated!"

#### Test 2: Past Date Prevention
1. Go to Ground Allocations
2. Try to schedule an activity in the past
3. ✅ System should show an error: "Cannot schedule in the past!"

#### Test 3: User-Activity Eligibility
1. Create a user with a specific ability type
2. Check Activity Categories to see which activities they can participate in
3. The system maintains this relationship for reporting

---

## 📊 Features to Explore

### Dashboard
- View total counts of users, activities, grounds
- See upcoming events
- Analyze user distribution by ability type
- Quick navigation buttons

### User Management
- Complete CRUD with relationships
- Filter by active/deleted
- Dropdown selections for roles, ability types, organizations

### Ground Allocations
- Visual indicators for upcoming vs past events
- Duration calculation
- Conflict prevention
- Time validation

---

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error in Browser Console
**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
1. Check API `Program.cs` has CORS configured
2. Verify `allowedOrigins` in API `appsettings.json` includes `http://localhost:4200`
3. Restart both API and Angular app

### Issue 2: Database Connection Failed
**Error:** `Cannot open database "ShauryaDB"`

**Solution:**
```bash
# Recreate database
dotnet ef database drop
dotnet ef database update
```

### Issue 3: Port Already in Use
**Error:** `Port 4200 is already in use`

**Solution:**
```bash
ng serve --port 4201
```

Then update environment.ts if needed.

### Issue 4: API Returns 404
**Solution:**
1. Check API is running (should see console output)
2. Verify URL in `environment.ts` matches API URL
3. Check Swagger works: `https://localhost:7000/swagger`

### Issue 5: Module Not Found Errors
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

---

## 🚀 Production Deployment

### API Deployment
1. Update `appsettings.json` with production connection string
2. Build: `dotnet publish -c Release`
3. Deploy to IIS, Azure, or Docker

### UI Deployment
1. Update `environment.prod.ts` with production API URL
2. Build: `npm run build`
3. Deploy `dist/` folder to web server (Nginx, Apache, Azure Static Web Apps)

---

## 📝 Project Structure Summary

```
C:\ProjectShaurya\
├── ShauryaAPI\
│   └── FriendsSociety.Shaurya\
│       ├── Controllers/        # 8 API controllers
│       ├── Entities/           # 8 data models
│       ├── Data/              # DbContext
│       ├── Services/          # Business logic
│       └── Migrations/        # Database migrations
│
└── ShauryaUI\
    └── src/
        └── app/
            ├── components/     # 9 feature components
            ├── services/       # 8 API services
            └── models/         # TypeScript interfaces
```

---

## ✅ Checklist

- [ ] .NET 8 SDK installed
- [ ] Node.js & npm installed
- [ ] Angular CLI installed
- [ ] SQL Server running
- [ ] API project builds successfully
- [ ] Database created via migrations
- [ ] API running on https://localhost:7000
- [ ] Swagger UI accessible
- [ ] Angular dependencies installed
- [ ] Angular app running on http://localhost:4200
- [ ] Dashboard loads successfully
- [ ] Can perform CRUD operations
- [ ] Ground allocation conflict detection works

---

## 📞 Support

If you encounter issues:
1. Check console errors (F12 in browser)
2. Verify API is running and accessible
3. Check database connectivity
4. Ensure CORS is properly configured

---

## 🎉 Success!

If you've completed all steps, you now have a fully functional Activity Management System with:
- ✅ Complete CRUD for 8 entities
- ✅ Business logic (scheduling, conflict detection)
- ✅ User-friendly interface
- ✅ Real-time analytics
- ✅ Production-ready code

**Happy Managing! 🏃‍♂️🎯**
