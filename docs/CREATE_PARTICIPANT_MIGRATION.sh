# Run this command in the API project directory to create and apply the migration

cd C:\ProjectShaurya\ShauryaAPI\FriendsSociety.Shaurya

# Create migration
dotnet ef migrations add AddParticipantTable

# Update database
dotnet ef database update

# Verify the migration was successful
# Check that Participants table was created in the database
