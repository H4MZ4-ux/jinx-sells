import { supabase } from "@/integrations/supabase/client";

export type StockMap = Record<string, number>;

export async function fetchStockMap(): Promise<StockMap> {
  const { data, error } = await supabase
    .from("stock_levels")
    .select("product_id, stock");

  if (error) throw error;

  const map: StockMap = {};
  for (const row of data ?? []) map[row.product_id] = row.stock ?? 0;
  return map;
}
