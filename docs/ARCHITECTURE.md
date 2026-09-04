# 🏗️ Shaurya System Architecture

## 📐 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                     http://localhost:4200                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTP Requests
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                    ANGULAR 18 APPLICATION                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    App Component (Root)                    │ │
│  │              Sidebar Navigation + Router Outlet            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─────────────────────── Components ────────────────────────┐  │
│  │  Dashboard  │  Users  │  Roles  │  Organizations         │  │
│  │  AbilityTypes │ Activities │ ActivityCategories │ Grounds │  │
│  │              Ground Allocations (Scheduling)               │  │
│  └────────────────────────────────────────────────────────────┘ │
│                            │                                     │
│                            │ Uses                                │
│                            ▼                                     │
│  ┌─────────────────────── Services ──────────────────────────┐  │
│  │  UserService  │  RoleService  │  OrganizationService     │  │
│  │  AbilityTypeService │ ActivityService │ GroundService    │  │
│  │  ActivityCategoryService │ GroundAllocationService       │  │
│  └────────────────────────────────────────────────────────────┘ │
│                            │                                     │
│                            │ HttpClient                          │
│                            │                                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                             │ REST API Calls
                             │ (JSON over HTTP)
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│               ASP.NET CORE 8 WEB API                             │
│                https://localhost:7000/api                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                      API Controllers                       │ │
│  │  UsersController  │  RolesController  │ OrganizationsCtrl │ │
│  │  AbilityTypesCtrl │  ActivitiesCtrl  │  GroundsCtrl      │ │
│  │  ActivityCategoriesCtrl │ GroundAllocationsCtrl          │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            │                                     │
│                            │ Uses                                │
│                            ▼                                     │
│  ┌─────────────────── Data Context ──────────────────────────┐  │
│  │              Entity Framework Core DbContext               │ │
│  │              - Connection Management                       │ │
│  │              - Relationship Configuration                  │ │
│  │              - Change Tracking                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            │                                     │
│                            │ DbSets & LINQ                       │
│                            │                                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                             │ ADO.NET
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                     SQL SERVER DATABASE                          │
│                        (ShauryaDB)                               │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                         Tables                             │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐           │ │
│  │  │  Users   │  │  Roles   │  │Organizations │           │ │
│  │  └────┬─────┘  └────┬─────┘  └──────┬───────┘           │ │
│  │       │             │                │                    │ │
│  │       └─────────────┴────────────────┘                    │ │
│  │                     │                                      │ │
│  │  ┌──────────────┐   │   ┌──────────────┐                │ │
│  │  │ AbilityTypes │◄──┘   │  Activities  │                │ │
│  │  └──────┬───────┘       └──────┬───────┘                │ │
│  │         │                      │                          │ │
│  │         └──────────┬───────────┘                          │ │
│  │                    │                                      │ │
│  │         ┌──────────▼────────────┐                        │ │
│  │         │ ActivityCategories    │  (Junction Table)      │ │
│  │         └───────────────────────┘                        │ │
│  │                                                           │ │
│  │  ┌──────────┐       ┌────────────────────┐             │ │
│  │  │ Grounds  │◄──────┤ GroundAllocations  │             │ │
│  │  └──────────┘       └──────────┬─────────┘             │ │
│  │                                 │                        │ │
│  │                     ┌───────────▼────────┐              │ │
│  │                     │   Activities       │              │ │
│  │                     └────────────────────┘              │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### Create Operation (POST)
```
User Action (UI)
    │
    ▼
Component (Form Submission)
    │
    ▼
Service (HTTP POST)
    │
    ▼
API Controller (POST Endpoint)
    │
    ▼
DbContext (Add Entity)
    │
    ▼
SQL Server (INSERT)
    │
    ▼
Success Response
    │
    ▼
Service (Observable)
    │
    ▼
Component (Update UI)
    │
    ▼
User Feedback (Alert)
```

### Read Operation (GET)
```
Component (ngOnInit)
    │
    ▼
Service (HTTP GET)
    │
    ▼
API Controller (GET Endpoint)
    │
    ▼
DbContext (Query Entities)
    │
    ▼
SQL Server (SELECT)
    │
    ▼
JSON Response
    │
    ▼
Service (Observable)
    │
    ▼
Component (Display in Table)
```

## 🏛️ Layered Architecture

```
┌────────────────────────────────────────────────┐
│         PRESENTATION LAYER (Angular)           │
│  - Components (Views)                          │
│  - Templates (HTML)                            │
│  - Styles (SCSS)                               │
│  - User Interactions                           │
└────────────────┬───────────────────────────────┘
                 │
                 │ HTTP/REST
                 │
┌────────────────▼───────────────────────────────┐
│         APPLICATION LAYER (.NET API)           │
│  - Controllers (Request Handlers)              │
│  - Routing                                     │
│  - Validation                                  │
│  - CORS Configuration                          │
└────────────────┬───────────────────────────────┘
                 │
                 │ EF Core
                 │
┌────────────────▼───────────────────────────────┐
│         DATA ACCESS LAYER (EF Core)            │
│  - DbContext                                   │
│  - Entity Models                               │
│  - Migrations                                  │
│  - Relationship Configuration                  │
└────────────────┬───────────────────────────────┘
                 │
                 │ ADO.NET
                 │
┌────────────────▼───────────────────────────────┐
│         DATABASE LAYER (SQL Server)            │
│  - Tables                                      │
│  - Relationships                               │
│  - Constraints                                 │
│  - Indexes                                     │
└────────────────────────────────────────────────┘
```

## 🔐 Security & Communication

```
┌──────────────────────────────────────────────┐
│              Browser (Client)                │
│                                              │
│  Origin: http://localhost:4200               │
└───────────────────┬──────────────────────────┘
                    │
                    │ CORS Request
                    │ Origin Header
                    │
┌───────────────────▼──────────────────────────┐
│           API Server (Backend)               │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │       CORS Middleware                  │ │
│  │  - Check Origin                        │ │
│  │  - Add CORS Headers                    │ │
│  │  - Allow Methods: GET, POST, PUT, DEL  │ │
│  │  - Allow Headers: Content-Type, etc.   │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  Origin: https://localhost:7000              │
└──────────────────────────────────────────────┘
```

## 📊 Entity Relationship Diagram

```
┌──────────────┐
│    Users     │
├──────────────┤
│ UserID (PK)  │───┐
│ RoleID (FK)  │───┼──────────┐
│ AbilityID(FK)│───┼────┐     │
│ OrgID (FK)   │───┼──┐ │     │
│ Name         │   │  │ │     │
│ Age          │   │  │ │     │
│ Contact      │   │  │ │     │
│ IsDeleted    │   │  │ │     │
└──────────────┘   │  │ │     │
                   │  │ │     │
    ┌──────────────┘  │ │     │
    │                 │ │     │
    ▼                 │ │     │
┌──────────────┐      │ │     │
│    Roles     │      │ │     │
├──────────────┤      │ │     │
│ RoleID (PK)  │      │ │     │
│ Name         │      │ │     │
│ Permissions  │      │ │     │
└──────────────┘      │ │     │
                      │ │     │
       ┌──────────────┘ │     │
       │                │     │
       ▼                │     │
┌──────────────┐        │     │
│ AbilityTypes │        │     │
├──────────────┤        │     │
│ AbilityID(PK)│        │     │
│ Name         │        │     │
│ Description  │        │     │
│ IsDeleted    │        │     │
└──────┬───────┘        │     │
       │                │     │
       │    ┌───────────┘     │
       │    │                 │
       │    ▼                 │
       │ ┌──────────────┐     │
       │ │Organizations │     │
       │ ├──────────────┤     │
       │ │ OrgID (PK)   │     │
       │ │ Name         │     │
       │ │ Contact      │     │
       │ │ IsDeleted    │     │
       │ └──────────────┘     │
       │                      │
       │  ┌───────────────────┘
       │  │
       │  │    ┌──────────────┐
       │  │    │  Activities  │
       │  │    ├──────────────┤
       │  │    │ ActivityID PK│
       │  │    │ Name         │
       │  │    │ Rules        │
       │  │    │ IsDeleted    │
       │  │    └───────┬──────┘
       │  │            │
       │  │            │
       └──┼────────────┼────────┐
          │            │        │
          ▼            ▼        │
   ┌───────────────────────┐   │
   │  ActivityCategories   │   │
   ├───────────────────────┤   │
   │ CategoryID (PK)       │   │
   │ ActivityID (FK)  ─────┼───┘
   │ AbilityTypeID (FK) ───┘
   │ ExclusionType         │
   └───────────────────────┘


┌──────────────┐       ┌────────────────────┐
│   Grounds    │       │ GroundAllocations  │
├──────────────┤       ├────────────────────┤
│ GroundID (PK)│◄──────│ AllocationID (PK)  │
│ Name         │       │ GroundID (FK)      │
│ Location     │       │ ActivityID (FK) ───┼───┐
└──────────────┘       │ StartTime          │   │
                       │ EndTime            │   │
                       └────────────────────┘   │
                                                │
                                                │
                              ┌─────────────────┘
                              │
                              ▼
                       ┌──────────────┐
                       │  Activities  │
                       ├──────────────┤
                       │ ActivityID PK│
                       │ Name         │
                       │ Rules        │
                       └──────────────┘
```

## 🔄 Business Logic Flow

### Scheduling Workflow
```
┌─────────────────────────────────────────┐
│  User wants to schedule an event        │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Select Ground, Activity, Time          │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Frontend Validation                    │
│  - All fields filled?                   │
│  - End time > Start time?               │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Send to API                            │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Backend Validation                     │
│  - Is start time in future?             │
│  - Check for conflicts:                 │
│    Query existing allocations           │
│    for same ground with overlap         │
└──────────────┬──────────────────────────┘
               │
         ┌─────┴─────┐
         │           │
    Conflict?    No Conflict
         │           │
         ▼           ▼
   ┌─────────┐  ┌─────────┐
   │ Reject  │  │ Accept  │
   │ Return  │  │ Create  │
   │ Error   │  │ Record  │
   └─────────┘  └────┬────┘
                     │
                     ▼
              ┌─────────────┐
              │ Save to DB  │
              └──────┬──────┘
                     │
                     ▼
              ┌─────────────┐
              │ Return      │
              │ Success     │
              └──────┬──────┘
                     │
                     ▼
              ┌─────────────┐
              │ Update UI   │
              │ Show Alert  │
              └─────────────┘
```

## 🎯 Component Hierarchy

```
AppComponent (Root)
├── Sidebar Navigation
│   ├── Dashboard Link
│   ├── Users Link
│   ├── Roles Link
│   ├── Organizations Link
│   ├── Ability Types Link
│   ├── Activities Link
│   ├── Activity Categories Link
│   ├── Grounds Link
│   └── Ground Allocations Link
│
└── Router Outlet
    ├── DashboardComponent
    │   ├── Statistics Cards
    │   ├── Recent Allocations
    │   ├── User Distribution Chart
    │   └── Quick Actions
    │
    ├── UsersComponent
    │   ├── User List Table
    │   └── User Form (Create/Edit)
    │
    ├── RolesComponent
    │   ├── Role List Table
    │   └── Role Form
    │
    ├── OrganizationsComponent
    │   ├── Organization List Table
    │   └── Organization Form
    │
    ├── AbilityTypesComponent
    │   ├── Ability Types List Table
    │   └── Ability Type Form
    │
    ├── ActivitiesComponent
    │   ├── Activity List Table
    │   └── Activity Form
    │
    ├── ActivityCategoriesComponent
    │   ├── Categories List Table
    │   └── Category Form (with dropdowns)
    │
    ├── GroundsComponent
    │   ├── Ground List Table
    │   └── Ground Form
    │
    └── GroundAllocationsComponent
        ├── Allocations List Table (with status)
        └── Allocation Form (with conflict check)
```

## 🌐 API Endpoint Structure

```
https://localhost:7000/api/
│
├── /Users
│   ├── GET    /          → Get all users
│   ├── GET    /{id}      → Get user by ID
│   ├── POST   /          → Create user
│   ├── PUT    /{id}      → Update user
│   └── DELETE /{id}      → Delete user
│
├── /Roles
│   ├── GET    /
│   ├── GET    /{id}
│   ├── POST   /
│   ├── PUT    /{id}
│   └── DELETE /{id}
│
├── /Organizations
│   ├── GET    /
│   ├── GET    /{id}
│   ├── POST   /
│   ├── PUT    /{id}
│   └── DELETE /{id}
│
├── /AbilityTypes
│   ├── GET    /
│   ├── GET    /{id}
│   ├── POST   /
│   ├── PUT    /{id}
│   └── DELETE /{id}
│
├── /Activities
│   ├── GET    /
│   ├── GET    /{id}
│   ├── POST   /
│   ├── PUT    /{id}
│   └── DELETE /{id}
│
├── /ActivityCategories
│   ├── GET    /
│   ├── GET    /{id}
│   ├── POST   /
│   ├── PUT    /{id}
│   └── DELETE /{id}
│
├── /Grounds
│   ├── GET    /
│   ├── GET    /{id}
│   ├── POST   /
│   ├── PUT    /{id}
│   └── DELETE /{id}
│
└── /GroundAllocations
    ├── GET    /
    ├── GET    /{id}
    ├── POST   /          → With conflict validation
    ├── PUT    /{id}
    └── DELETE /{id}
```

---

**This architecture ensures scalability, maintainability, and separation of concerns! 🏗️**
