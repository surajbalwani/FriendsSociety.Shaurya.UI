# Excel Template with Dynamic Game Dropdowns - Setup Guide

## Overview
This guide shows how to create an Excel template with cascading dropdowns where:
1. **Ability Type** dropdown shows all 6 disability types
2. **Game1** and **Game2** dropdowns show ONLY games matching the selected Ability Type and Age

## Excel Template Structure

### Sheet 1: "ParticipantData" (Main Data Entry Sheet)

| Column | Header | Type | Notes |
|--------|--------|------|-------|
| A | Name | Text | Required |
| B | Age | Number | Required (8-27) |
| C | Gender | Dropdown | Male/Female/Other |
| D | Blood Group | Dropdown | A+, A-, B+, B-, O+, O-, AB+, AB- |
| E | Organization | Text/Dropdown | Organization name or ID |
| F | Ability Type | Dropdown | **Dynamic from reference sheet** |
| G | Contact | Text | Phone number |
| H | Emergency Contact | Text | Emergency phone |
| I | Address | Text | Full address |
| J | Medical Notes | Text | Optional |
| K | Game1 | Dropdown | **Dynamic based on F & B** |
| L | Game2 | Dropdown | **Dynamic based on F & B** |

### Sheet 2: "ReferenceData" (Hidden - Contains lookup data)

#### Section 1: Ability Types (Columns A-B)
```
Row 1: AbilityTypeID | AbilityTypeName
Row 2: 1 | Physically challenged by leg
Row 3: 2 | Physically challenged by Hand
Row 4: 3 | Intellectually challenged
Row 5: 4 | DEAF AND DUMB
Row 6: 5 | VISUALLY IMPAIRED & PARTIALLY VISUALLY IMPAIRED
Row 7: 6 | LEARNING DISABILITY
```

#### Section 2: Games Master List (Columns D-I)
```
Headers: GameID | GameName | GameCode | DisabilityCode | AgeCategory | AgeRange
Example rows:
1 | Archery | 1A01 | 1 | A | 8-12
2 | Bocce | 1A02 | 1 | A | 8-12
3 | Carrom | 1A03 | 1 | A | 8-12
... (192 total rows - all combinations)
```

#### Section 3: Age Category Lookup (Columns K-M)
```
Row 1: AgeMin | AgeMax | Category
Row 2: 8 | 12 | A
Row 3: 13 | 17 | B
Row 4: 18 | 22 | C
Row 5: 23 | 27 | D
```

## Step-by-Step Setup Instructions

### Step 1: Create Reference Data Sheet

1. Create a new sheet named "ReferenceData"
2. Add Ability Types in columns A-B (rows 1-7)
3. Add Games data in columns D-I (rows 1-193, including header)
4. Add Age Category lookup in columns K-M (rows 1-5)

### Step 2: Setup Named Ranges

Create the following named ranges (Formulas → Define Name):

1. **AbilityTypeList**: `=ReferenceData!$B$2:$B$7`
2. **AbilityTypeIDs**: `=ReferenceData!$A$2:$A$7`
3. **GamesList**: `=ReferenceData!$D$2:$I$193`
4. **AgeCategoryLookup**: `=ReferenceData!$K$2:$M$5`

### Step 3: Create Helper Columns in ParticipantData Sheet

Add these helper columns (can be hidden after setup):

**Column M**: Ability Type ID (hidden)
```excel
=IFERROR(INDEX(ReferenceData!$A$2:$A$7, MATCH(F2, ReferenceData!$B$2:$B$7, 0)), "")
```

**Column N**: Age Category (hidden)
```excel
=IF(AND(B2>=8,B2<=12),"A",IF(AND(B2>=13,B2<=17),"B",IF(AND(B2>=18,B2<=22),"C",IF(AND(B2>=23,B2<=27),"D",""))))
```

### Step 4: Create Data Validations

#### For Ability Type (Column F):
1. Select F2:F1000
2. Data → Data Validation → List
3. Source: `=AbilityTypeList`
4. Error Alert: "Please select a valid Ability Type"

#### For Game1 (Column K) - Advanced Method:

Since Excel doesn't natively support cascading dropdowns with complex conditions, we need to use a helper approach:

**Option A: Using Office 365 Dynamic Arrays (FILTER function)**

If you have Office 365, use this formula in a helper range:

1. Create a helper column (Column O) with this formula:
```excel
=IF(AND(M2<>"",N2<>""),
    TEXTJOIN(",",TRUE,
        FILTER(ReferenceData!$C$2:$C$193,
            (ReferenceData!$E$2:$E$193=M2)*
            (ReferenceData!$F$2:$F$193=N2)
        )
    ),
    ""
)
```

2. Then for Game1 validation:
- Select K2
- Data → Data Validation → Custom → List
- Formula: `=INDIRECT("O2")` (split by comma)

**Option B: Using Traditional Method (All Excel Versions)**

1. In ReferenceData sheet, create separate lists for each Disability+Age combination:
   - Name ranges like: Games_1A, Games_1B, Games_1C, etc.

2. For each named range (example for Disability 1, Age A):
```
Games_1A = Filter games where DisabilityCode=1 AND AgeCategory=A
```

3. In ParticipantData, use INDIRECT for validation:
```excel
Data Validation for K2:
Source: =INDIRECT("Games_"&M2&N2)
```

### Step 5: Copy Formula Down

1. Select row 2 (first data row) with all formulas
2. Copy formulas down to row 1000
3. Hide helper columns (M, N, O)

## Complete Excel Formula Reference

### ParticipantData Sheet Formulas:

| Column | Formula | Purpose |
|--------|---------|---------|
| M (hidden) | `=IFERROR(INDEX(ReferenceData!$A$2:$A$7,MATCH(F2,ReferenceData!$B$2:$B$7,0)),"")` | Get Ability Type ID |
| N (hidden) | `=IF(AND(B2>=8,B2<=12),"A",IF(AND(B2>=13,B2<=17),"B",IF(AND(B2>=18,B2<=22),"C",IF(AND(B2>=23,B2<=27),"D",""))))` | Get Age Category |

### Data Validations:

**Gender (Column C):**
```
List: Male,Female,Other
```

**Blood Group (Column D):**
```
List: A+,A-,B+,B-,O+,O-,AB+,AB-
```

**Ability Type (Column F):**
```
Source: =AbilityTypeList
```

**Game1 (Column K):**
```
Source: =INDIRECT("Games_"&M2&N2)
Error Alert: "Please select Ability Type and Age first"
```

**Game2 (Column L):**
```
Source: =INDIRECT("Games_"&M2&N2)
Allow Blank: Yes
```

## Creating Named Ranges for Each Game Combination

You need to create 24 named ranges (6 disabilities × 4 age categories):

### Method 1: Manual Creation

For each combination, create a named range:

1. **Games_1A**: Filter ReferenceData games where DisabilityCode=1 AND AgeCategory=A
2. **Games_1B**: Filter ReferenceData games where DisabilityCode=1 AND AgeCategory=B
3. ... (continue for all 24 combinations)

### Method 2: Using Advanced Filter (Recommended)

In ReferenceData sheet, create filtered lists:

**Example for Games_1A (starting at column P):**
```excel
=FILTER(ReferenceData!$C$2:$C$193,
    (ReferenceData!$E$2:$E$193=1)*
    (ReferenceData!$F$2:$F$193="A")
)
```

Then define named range: `Games_1A = ReferenceData!$P$2:$P$9` (8 games per combination)

## Simplified Alternative: Use Game Codes

Instead of showing full game names, show game codes with descriptions:

**In Game1 dropdown:**
```
Display: 1A01 - Archery (Leg Disability, Age 8-12)
Value stored: 1A01
```

This simplifies the dropdown while providing clear information.

## VBA Solution (Advanced)

For more dynamic dropdowns, use VBA:

```vba
Private Sub Worksheet_Change(ByVal Target As Range)
    Dim ws As Worksheet
    Dim refSheet As Worksheet
    Dim abilityID As String
    Dim ageCategory As String
    Dim gameList As String
    Dim i As Long
    
    Set ws = ActiveSheet
    Set refSheet = ThisWorkbook.Sheets("ReferenceData")
    
    ' Check if Age or Ability Type changed
    If Not Intersect(Target, ws.Range("B:B,F:F")) Is Nothing Then
        
        Application.EnableEvents = False
        
        For Each cell In Target
            If cell.Row > 1 Then
                ' Get ability type ID
                abilityID = ws.Cells(cell.Row, "M").Value
                ' Get age category
                ageCategory = ws.Cells(cell.Row, "N").Value
                
                If abilityID <> "" And ageCategory <> "" Then
                    ' Build game list
                    gameList = ""
                    For i = 2 To refSheet.Cells(refSheet.Rows.Count, "D").End(xlUp).Row
                        If refSheet.Cells(i, "E").Value = Val(abilityID) And _
                           refSheet.Cells(i, "F").Value = ageCategory Then
                            If gameList = "" Then
                                gameList = refSheet.Cells(i, "C").Value
                            Else
                                gameList = gameList & "," & refSheet.Cells(i, "C").Value
                            End If
                        End If
                    Next i
                    
                    ' Set validation for Game1 and Game2
                    With ws.Cells(cell.Row, "K").Validation
                        .Delete
                        .Add Type:=xlValidateList, Formula1:=gameList
                    End With
                    
                    With ws.Cells(cell.Row, "L").Validation
                        .Delete
                        .Add Type:=xlValidateList, Formula1:=gameList
                    End With
                End If
            End If
        Next cell
        
        Application.EnableEvents = True
    End If
End Sub
```

## Sample Data for Testing

```
Name | Age | Gender | BloodGroup | Organization | AbilityType | Contact | Game1 | Game2
John | 10 | Male | O+ | School A | Physically challenged by leg | 9876543210 | 1A01 | 1A02
Mary | 15 | Female | A+ | School B | VISUALLY IMPAIRED | 9123456789 | 5B04 | 5B06
```

## Export to CSV for Upload

When complete:
1. File → Save As → CSV (Comma delimited)
2. Ensure Game1 contains game codes (e.g., "1A01")
3. Upload CSV to application

## Validation Rules Summary

1. **Age must be 8-27** for games to appear
2. **Ability Type must be selected** before Game dropdowns work
3. **Game1 is required**, Game2 is optional
4. **Game codes must match** Ability Type and Age category
5. **Same game can be selected** for both Game1 and Game2 (optional: add validation to prevent this)

## Pre-populated Games Data

Use this SQL query to export games data to Excel ReferenceData sheet:

```sql
SELECT 
    GameID,
    Name as GameName,
    GameCode,
    DisabilityTypeCode,
    AgeCategory,
    CONCAT(AgeRangeStart, '-', AgeRangeEnd) as AgeRange
FROM Games
WHERE IsDeleted = 0
ORDER BY DisabilityTypeCode, AgeCategory, GameCodeNumber;
```

Import this into ReferenceData columns D-I.

## Troubleshooting

**Issue: Dropdowns not working**
- Check named ranges are correctly defined
- Verify helper formulas in columns M and N
- Ensure ReferenceData sheet has all games

**Issue: Wrong games showing**
- Verify Ability Type ID matches DisabilityTypeCode in games
- Check Age Category formula is correct
- Confirm game data has correct DisabilityTypeCode values

**Issue: #REF! errors**
- Named range might be pointing to wrong cells
- Check if ReferenceData sheet was renamed
- Verify all 192 games are in ReferenceData

## Quick Setup Checklist

- [ ] Create ReferenceData sheet
- [ ] Add 6 Ability Types (rows 2-7)
- [ ] Add 192 Games with all fields (rows 2-193)
- [ ] Add Age Category lookup (rows 2-5)
- [ ] Create named ranges
- [ ] Add helper formulas in ParticipantData
- [ ] Setup data validations for all columns
- [ ] Create 24 game named ranges (Games_1A through Games_6D)
- [ ] Test with sample data
- [ ] Hide helper columns
- [ ] Hide/protect ReferenceData sheet
- [ ] Save as template

## Alternative: Simplified Version

If cascading dropdowns are too complex, use this simpler approach:

1. Show ALL games in Game1/Game2 dropdowns
2. Add data validation message: "Please select games matching your Ability Type and Age"
3. Validate on server side when uploading
4. Return errors for mismatched games

This is easier to set up but relies on users selecting correctly.

---

**Recommendation**: Use the VBA solution for best user experience, or use the Named Ranges method for a formula-only solution.
