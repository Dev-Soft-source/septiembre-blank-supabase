-- Rename/create triggers to required names without changing behavior
-- Hotel edit trigger
DROP TRIGGER IF EXISTS trigger_hotel_edit_notify ON public.hotels;
DROP TRIGGER IF EXISTS trigger_notify_admin_on_hotel_edit ON public.hotels;
CREATE TRIGGER trigger_notify_admin_on_hotel_edit
AFTER UPDATE ON public.hotels
FOR EACH ROW
EXECUTE PROCEDURE public.handle_hotel_edit_notify();

-- Hotel recommendation trigger
DROP TRIGGER IF EXISTS trigger_hotel_recommendation_notify ON public.hotel_referrals;
DROP TRIGGER IF EXISTS trigger_notify_admin_on_hotel_recommendation ON public.hotel_referrals;
CREATE TRIGGER trigger_notify_admin_on_hotel_recommendation
AFTER INSERT ON public.hotel_referrals
FOR EACH ROW
EXECUTE PROCEDURE public.handle_hotel_recommendation_notify();