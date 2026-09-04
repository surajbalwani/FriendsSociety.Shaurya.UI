# 🚀 Shaurya - Quick Reference Card

## 📍 Project Location
```
C:\ProjectShaurya\
```

## ⚡ Quick Start (Copy & Paste)

### Terminal 1 - Start API:
```bash
cd C:\ProjectShaurya\ShauryaAPI\FriendsSociety.Shaurya
dotnet run
```

### Terminal 2 - Start UI:
```bash
cd C:\ProjectShaurya\ShauryaUI
npm start
```

## 🌐 Access URLs
| Service | URL |
|---------|-----|
| Angular UI | http://localhost:4200 |
| API Swagger | https://localhost:7000/swagger |
| API Base | https://localhost:7000/api |

## 📋 API Endpoints
```
GET/POST    /api/Users
GET/POST    /api/Roles
GET/POST    /api/Organizations
GET/POST    /api/AbilityTypes
GET/POST    /api/Activities
GET/POST    /api/ActivityCategories
GET/POST    /api/Grounds
GET/POST    /api/GroundAllocations
```

## 🗂️ Angular Routes
```
/dashboard              - Analytics dashboard
/users                  - User management
/roles                  - Role management
/organizations          - Organization management
/ability-types          - Ability type management
/activities             - Activity management
/activity-categories    - Activity-Ability linking
/grounds                - Ground management
/ground-allocations     - Schedule management
```

## 🔧 Common Commands

### Backend:
```bash
# Restore packages
dotnet restore

# Build
dotnet build

# Run
dotnet run

# Update database
dotnet ef database update

# Create new migration
dotnet ef migrations add MigrationName

# Drop database
dotnet ef database drop
```

### Frontend:
```bash
# Install dependencies
npm install

# Start dev server
npm start

# Build for production
npm run build

# Generate component
ng generate component component-name

# Generate service
ng generate service service-name
```

## 🎯 First-Time Setup Checklist
- [ ] Run API: `dotnet run` in API folder
- [ ] Verify Swagger: https://localhost:7000/swagger
- [ ] Run UI: `npm install` then `npm start` in UI folder
- [ ] Open browser: http://localhost:4200
- [ ] Add Roles (Admin, Organizer, Participant)
- [ ] Add Organizations
- [ ] Add Ability Types
- [ ] Add Activities
- [ ] Add Grounds
- [ ] Link Activities with Ability Types
- [ ] Add Users
- [ ] Schedule Ground Allocations

## 📊 Entity Relationships
```
User
├── Role (1:M)
├── AbilityType (1:M)
└── Organization (1:M)

Activity
├── ActivityCategories (1:M)
│   └── AbilityType (M:1)
└── GroundAllocations (1:M)
    └── Ground (M:1)
```

## 🎨 UI Components
| Component | Purpose |
|-----------|---------|
| Dashboard | Analytics & quick actions |
| Users | Full CRUD for participants |
| Roles | Manage user roles |
| Organizations | Manage institutions |
| Ability Types | Manage ability categories |
| Activities | Manage sports/events |
| Activity Categories | Link activities ↔ ability types |
| Grounds | Manage venues |
| Ground Allocations | Schedule events with conflict detection |

## 🔑 Key Features
✅ Complete CRUD for 8 entities  
✅ Soft delete (Users, Activities, etc.)  
✅ Conflict detection (Ground allocations)  
✅ Past date prevention  
✅ Duration calculation  
✅ Real-time validation  
✅ Dashboard analytics  
✅ Responsive design  

## 🐛 Troubleshooting

### CORS Error:
Check API appsettings.json → allowedOrigins includes `http://localhost:4200`

### Database Error:
```bash
dotnet ef database drop
dotnet ef database update
```

### Port in Use:
```bash
ng serve --port 4201
```

### Module Not Found:
```bash
rm -rf node_modules
npm install
```

## 📝 Useful Keyboard Shortcuts

### Visual Studio:
- F5 - Start debugging
- Ctrl+F5 - Start without debugging
- Ctrl+Shift+B - Build solution

### VS Code:
- Ctrl+` - Toggle terminal
- Ctrl+P - Quick open
- F5 - Start debugging

### Browser:
- F12 - Developer tools
- Ctrl+Shift+R - Hard refresh

## 📚 Documentation Files
| File | Purpose |
|------|---------|
| SETUP_GUIDE.md | Complete setup instructions |
| PROJECT_SUMMARY.md | Full project overview |
| ShauryaUI/README.md | Angular app documentation |
| ShauryaAPI docs/ | Database diagrams |

## 🎯 Common Tasks

### Add New User:
1. Navigate to Users page
2. Click "+ Add New User"
3. Fill: Name, Age, Role, Ability Type, Organization
4. Click "Create User"

### Schedule Event:
1. Navigate to Ground Allocations
2. Click "+ Schedule Ground"
3. Select: Ground, Activity, Start/End Time
4. System validates automatically
5. Click "Schedule Allocation"

### Link Activity with Ability Type:
1. Navigate to Activity Categories
2. Click "+ Add Category"
3. Select: Activity, Ability Type, Exclusion Type
4. Click "Save"

## 💡 Tips
- Always start API before UI
- Check Swagger to verify API is running
- Use browser dev tools (F12) for debugging
- Dashboard shows real-time statistics
- System prevents scheduling conflicts automatically
- Soft delete preserves data integrity

## 🆘 Emergency Commands

### Reset Everything:
```bash
# Backend
cd C:\ProjectShaurya\ShauryaAPI\FriendsSociety.Shaurya
dotnet ef database drop -f
dotnet ef database update

# Frontend
cd C:\ProjectShaurya\ShauryaUI
rm -rf node_modules
npm install
```

## 📞 Need Help?
1. Check console errors (F12 in browser)
2. Verify API is running (check Swagger)
3. Check database exists (SQL Server)
4. Review SETUP_GUIDE.md

---

**Keep this card handy for quick reference! 📌**
