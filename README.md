# Shaurya UI - Activity Management System

A comprehensive Angular 18 application for managing activities, users, and ground allocations for inclusive sports events.

## 🚀 Features

### Complete CRUD Operations for All Entities:
- **Users** - Manage participants with roles, ability types, and organizations
- **Roles** - Define user permissions (Admin, Organizer, Participant)
- **Organizations** - Manage participating institutions
- **Ability Types** - Define different ability categories
- **Activities** - Create and manage sports/events
- **Activity Categories** - Link activities with ability types for eligibility
- **Grounds** - Manage venues/facilities
- **Ground Allocations** - Schedule activities with conflict detection

### Business Logic Features:
- 📊 **Dashboard** - Real-time statistics and insights
- 📅 **Schedule Management** - Ground booking with conflict prevention
- 🔍 **Filtering** - View active/deleted records
- 📈 **Analytics** - User distribution by ability type
- ⚡ **Real-time Validation** - Prevent double-booking and past scheduling

## 📋 Prerequisites

- Node.js (v18 or higher)
- Angular CLI (v18)
- .NET 8 API running on https://localhost:7000

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   cd ShauryaUI
   npm install
   ```

2. **Update API URL** (if different):
   Edit `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'https://localhost:7000/api'  // Update this if needed
   };
   ```

3. **Start the application:**
   ```bash
   npm start
   ```

4. **Open browser:**
   Navigate to `http://localhost:4200`

## 📁 Project Structure

```
src/
├── app/
│   ├── components/           # All UI components
│   │   ├── dashboard/        # Dashboard with analytics
│   │   ├── users/            # User management
│   │   ├── roles/            # Role management
│   │   ├── organizations/    # Organization management
│   │   ├── ability-types/    # Ability type management
│   │   ├── activities/       # Activity management
│   │   ├── activity-categories/  # Activity-Ability linking
│   │   ├── grounds/          # Ground management
│   │   └── ground-allocations/   # Schedule management
│   ├── models/               # TypeScript interfaces
│   ├── services/             # API services
│   ├── app.component.*       # Root component with navigation
│   ├── app.routes.ts         # Routing configuration
│   └── app.config.ts         # App configuration
├── environments/             # Environment configs
└── styles.scss              # Global styles
```

## 🎯 Usage Guide

### Dashboard
- View system statistics
- See recent allocations
- Analyze user distribution by ability type
- Quick access to all modules

### User Management
- Create users with role, ability type, and organization
- Edit user details
- Soft delete (marks as deleted, doesn't remove)
- View all active users

### Ground Allocations (Scheduling)
- **Schedule grounds** for activities
- **Automatic conflict detection** - prevents double booking
- **Date/time validation** - cannot schedule in the past
- View upcoming vs past events
- Calculate event duration automatically

### Activity Categories
- Link activities with ability types
- Define eligibility rules (Inclusive, Exclusive, Modified)
- Manage which activities are suitable for which ability types

## 🔌 API Integration

All services connect to the .NET API:
- Base URL: `https://localhost:7000/api`
- Endpoints: `/Users`, `/Roles`, `/Organizations`, `/AbilityTypes`, `/Activities`, `/ActivityCategories`, `/Grounds`, `/GroundAllocations`

## 🎨 UI Features

- **Responsive Design** - Works on desktop and tablet
- **Sidebar Navigation** - Collapsible sidebar with icons
- **Form Validation** - Required field validation
- **Success/Error Alerts** - User feedback for all actions
- **Loading States** - Visual feedback during API calls
- **Color-coded Status** - Upcoming vs past events
- **Modal Forms** - Inline editing without page navigation

## 🚦 Business Rules Implemented

1. **Soft Delete** - Users, activities, organizations, and ability types use `isDeleted` flag
2. **Conflict Prevention** - Ground allocations check for overlapping times
3. **Time Validation** - Cannot schedule events in the past
4. **Duration Calculation** - Automatically calculates event duration
5. **Data Relationships** - Proper foreign key handling with dropdowns

## 🔧 Development

### Build for production:
```bash
npm run build
```

### Run development server:
```bash
npm start
```

### Lint code:
```bash
ng lint
```

## 📦 Dependencies

- **Angular 18** - Latest Angular framework
- **RxJS** - Reactive programming
- **Angular Router** - Navigation
- **Angular Forms** - Form handling
- **HttpClient** - API communication

## 🌟 Key Highlights

- ✅ **Complete CRUD** for all 8 entities
- ✅ **Standalone Components** - Modern Angular architecture
- ✅ **Lazy Loading** - Optimized performance
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Clean Code** - Well-organized and maintainable
- ✅ **Business Logic** - Real-world scheduling features
- ✅ **User Experience** - Intuitive interface

## 🐛 Troubleshooting

### CORS Errors
Make sure your .NET API has CORS enabled and allows `http://localhost:4200`

### API Connection Failed
1. Verify API is running on `https://localhost:7000`
2. Check `environment.ts` has correct API URL
3. Ensure SSL certificate is trusted

### Port Already in Use
```bash
ng serve --port 4201
```

## 📝 Notes

- Default API port: `https://localhost:7000`
- Default Angular port: `http://localhost:4200`
- All dates/times use ISO format for API communication
- Forms validate before submission
- Confirmation dialogs for delete operations

## 🤝 Contributing

This is a complete production-ready application with:
- Full CRUD operations
- Business logic implementation
- Clean, maintainable code
- Modern Angular best practices

---

**Built with Angular 18 for FriendsSociety.Shaurya API**
