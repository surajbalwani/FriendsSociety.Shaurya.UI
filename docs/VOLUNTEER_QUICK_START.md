# 🚀 Quick Start - Volunteer System

## Run These Commands in Order:

### 1. Create and Apply Migration

```bash
cd C:\ProjectShaurya\ShauryaAPI\FriendsSociety.Shaurya

# Create migration
dotnet ef migrations add AddVolunteerTable

# Apply to database
dotnet ef database update
```

### 2. Start API

```bash
# From same directory
dotnet run
```

### 3. Test in Swagger

Open: https://localhost:7000/swagger

**Create Test Volunteers:**

POST /api/Volunteers
```json
{
  "name": "Alice Johnson",
  "contact": "1234567890",
  "whatsAppNo": "1234567890",
  "email": "alice@example.com",
  "address": "123 Oak Street"
}
```

POST /api/Volunteers
```json
{
  "name": "Bob Smith",
  "contact": "0987654321",
  "whatsAppNo": "0987654321",
  "email": "bob@example.com",
  "address": "456 Pine Avenue"
}
```

POST /api/Volunteers
```json
{
  "name": "Charlie Brown",
  "contact": "5551234567",
  "whatsAppNo": "5551234567",
  "email": "charlie@example.com",
  "address": "789 Maple Drive"
}
```

### 4. Start Angular UI

```bash
cd C:\ProjectShaurya\ShauryaUI
npm start
```

### 5. Test Duty Management

1. Navigate to http://localhost:4200
2. Login
3. Go to "Duty" page
4. Click "Create New Team"
5. You should see Alice, Bob, Charlie in dropdowns
6. Select leader
7. Select team members  
8. Submit

---

## ✅ Success Checklist

- [ ] Migration created successfully
- [ ] Database updated successfully  
- [ ] API starts without errors
- [ ] /api/Volunteers visible in Swagger
- [ ] Can create volunteers via Swagger
- [ ] GET /api/Volunteers returns data
- [ ] UI compiles without errors
- [ ] Duty page loads
- [ ] Volunteers appear in dropdowns
- [ ] Can create team with volunteers
- [ ] Team details show correctly

---

## 🐛 Troubleshooting

### Error: "Volunteers table does not exist"
```bash
cd C:\ProjectShaurya\ShauryaAPI\FriendsSociety.Shaurya
dotnet ef database update
```

### Error: "Cannot find VolunteersController"
**Solution:** Restart the API completely

### Error: "volunteer.volunteerID is undefined"
**Solution:** 
1. Check API returns camelCase JSON
2. Restart Angular UI
3. Check browser console for errors

### Dropdown shows no volunteers
**Solution:**
1. Create volunteers in Swagger first
2. Check GET /api/Volunteers returns data
3. Check browser console (F12) for errors

---

## 📝 Database Check

```sql
-- Check Volunteers table exists
SELECT * FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME = 'Volunteers';

-- View volunteers
SELECT * FROM Volunteers WHERE IsDeleted = 0;

-- Check TeamAssignments foreign key
SELECT 
    fk.name AS ForeignKey,
    OBJECT_NAME(fk.parent_object_id) AS TableName,
    COL_NAME(fc.parent_object_id, fc.parent_column_id) AS ColumnName,
    OBJECT_NAME (fk.referenced_object_id) AS ReferencedTable
FROM 
    sys.foreign_keys AS fk
INNER JOIN 
    sys.foreign_key_columns AS fc 
    ON fk.object_id = fc.constraint_object_id
WHERE 
    OBJECT_NAME(fk.parent_object_id) = 'TeamAssignments';
```

Expected output: LeaderID → Volunteers table

---

**Ready to go!** 🎉
