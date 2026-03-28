create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Temporary debugging logs
  RAISE LOG 'handle_new_user triggered - new.id: %, new.raw_user_meta_data: %', 
    new.id, new.raw_user_meta_data;

  RAISE LOG 'Extracted role value: %', coalesce(new.raw_user_meta_data ->> 'role', 'guest');

  insert into public.profiles (id, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'role', 'guest')
  );

  RAISE LOG 'Profile insert completed successfully for user: %', new.id;

  return new;
end;
$$;