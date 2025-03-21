from supabase import create_client, Client

# Replace with your actual Supabase details
SUPABASE_URL = "https://ngnaehayrjwlccyguvia.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nbmFlaGF5cmp3bGNjeWd1dmlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MzE2NjksImV4cCI6MjA1NzUwNzY2OX0.XYPIwnE8vZGnXo17d5o0lOoO7Tit4omsN_UPBRdOKUM"

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Test connection by fetching all rows from the volunteer_history table
def fetch_volunteer_history():
    response = supabase.table("volunteer_history").select("*").execute()
    print(response)

if __name__ == "__main__":
    fetch_volunteer_history()
