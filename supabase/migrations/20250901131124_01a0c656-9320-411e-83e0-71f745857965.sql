-- Test the admin notification system by calling it directly
SELECT 
  net.http_post(
    url := 'https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/notify-admin-registration',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnZHpydmR3Z29vbWpubmVna2NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjgyOTQ3MiwiZXhwIjoyMDU4NDA1NDcyfQ.O7F1kRfZE4As7I5d22BCxkUjf5PDmIZdW_PMOCo7GQM'
    ),
    body := jsonb_build_object(
      'user', jsonb_build_object(
        'id', 'test-user-id',
        'email', 'test@example.com',
        'raw_user_meta_data', jsonb_build_object(
          'role', 'association',
          'association_name', 'TEST ASSOCIATION',
          'country', 'Spain'
        )
      ),
      'userData', jsonb_build_object(
        'registration_source', 'manual_test',
        'association_name', 'TEST ASSOCIATION',
        'responsible_person', 'Test Person',
        'country', 'Spain'
      )
    )
  ) as test_notification_result;