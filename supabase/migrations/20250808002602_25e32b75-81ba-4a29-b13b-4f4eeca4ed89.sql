-- Isolated fix: ensure handle_new_user is attached via AFTER INSERT trigger with required name
-- Do not modify other logic or schemas
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS trigger_handle_new_user_after_insert ON auth.users;

CREATE TRIGGER trigger_handle_new_user_after_insert
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_user();