
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP POLICY "Anyone can submit consultations" ON public.consultations;
CREATE POLICY "Anyone can submit consultations" ON public.consultations
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 200
    AND char_length(email) BETWEEN 3 AND 255
    AND char_length(phone) BETWEEN 5 AND 30
    AND char_length(case_type) BETWEEN 1 AND 100
    AND char_length(message) BETWEEN 1 AND 5000
    AND status = 'new'
  );

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
