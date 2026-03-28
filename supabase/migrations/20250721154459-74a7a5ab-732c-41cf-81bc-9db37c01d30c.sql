-- Create triggers for hotel_associations table to ensure proper user_id setting and code generation

-- Trigger to set association_code if not provided
CREATE TRIGGER set_association_code_trigger
    BEFORE INSERT ON public.hotel_associations
    FOR EACH ROW
    EXECUTE FUNCTION public.set_association_code();

-- Trigger to set user_id if not provided
CREATE TRIGGER set_association_user_id_trigger
    BEFORE INSERT ON public.hotel_associations
    FOR EACH ROW
    EXECUTE FUNCTION public.set_association_user_id();

-- Grant necessary permissions for authenticated users
GRANT INSERT ON public.hotel_associations TO authenticated;
GRANT SELECT ON public.hotel_associations TO authenticated;
GRANT UPDATE ON public.hotel_associations TO authenticated;