-- Create product stock table
CREATE TABLE public.product_stock (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_slug TEXT NOT NULL UNIQUE,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_stock ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read stock levels
CREATE POLICY "Anyone can view stock levels"
ON public.product_stock
FOR SELECT
USING (true);

-- Allow updates with a secret admin password (we'll verify in code)
CREATE POLICY "Allow all updates for now"
ON public.product_stock
FOR UPDATE
USING (true);

CREATE POLICY "Allow all inserts for now"
ON public.product_stock
FOR INSERT
WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_product_stock_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_product_stock_updated_at
BEFORE UPDATE ON public.product_stock
FOR EACH ROW
EXECUTE FUNCTION public.update_product_stock_updated_at();

-- Insert initial stock for all products
INSERT INTO public.product_stock (product_slug, stock_quantity) VALUES
  ('airpods-pro-2', 10),
  ('airpods-pro-3', 10),
  ('airpods-4s', 10),
  ('airpods-max', 5),
  ('airpods-max-midnight', 5),
  ('airpods-max-silver', 5),
  ('airpods-max-blue', 5),
  ('airpods-max-green', 5),
  ('airpods-max-pink', 5);