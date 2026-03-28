-- Add missing JSONB columns to hotels table for enhanced JotForm data
ALTER TABLE public.hotels 
ADD COLUMN IF NOT EXISTS banking_info JSONB,
ADD COLUMN IF NOT EXISTS laundry_service JSONB,
ADD COLUMN IF NOT EXISTS additional_data JSONB;

-- Add comment for documentation
COMMENT ON COLUMN public.hotels.banking_info IS 'Banking information: bank_name, iban_account, swift_bic, bank_country, account_holder';
COMMENT ON COLUMN public.hotels.laundry_service IS 'Laundry service options: available, self_service, full_service, external_redirect, pricing';
COMMENT ON COLUMN public.hotels.additional_data IS 'Store unmapped JotForm fields for future use';