// src/pages/Admin.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { products } from "@/data/products";

type StockRow = {
  product_id: string;
  quantity: number;
};

export default function Admin() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // local editable state: product_id -> quantity
  const [qty, setQty] = useState<Record<string, number>>({});

  const productList = useMemo(() => {
    // keep stable order
    return [...products].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);

      // Must be logged in
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        navigate("/auth");
        return;
      }

      // Fetch stock levels
      const { data, error } = await supabase
        .from("stock_levels")
        .select("product_id,quantity");

      if (error) {
        setError(
          `Failed to fetch stock levels. ${error.message} (check table + RLS + env vars)`
        );
        // still init defaults so page works
        const defaults: Record<string, number> = {};
        productList.forEach((p) => (defaults[p.id] = 0));
        setQty(defaults);
        setLoading(false);
        return;
      }

      const rows = (data || []) as StockRow[];

      const merged: Record<string, number> = {};
      productList.forEach((p) => (merged[p.id] = 0));
      rows.forEach((r) => {
        merged[r.product_id] = Number.isFinite(r.quantity) ? r.quantity : 0;
      });

      setQty(merged);
      setLoading(false);
    })();
  }, [navigate, productList]);

  async function onSave() {
    setSaving(true);
    setError(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        navigate("/auth");
        return;
      }

      const payload = productList.map((p) => ({
        product_id: p.id,
        quantity: Math.max(0, Math.floor(qty[p.id] ?? 0)),
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from("stock_levels")
        .upsert(payload, { onConflict: "product_id" });

      if (error) throw error;
    } catch (e: any) {
      setError(`Failed to save stock levels. ${String(e?.message || e)}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Stock Management</h1>
            <p className="mt-1 text-muted-foreground">Update product stock levels</p>
          </div>

          <Button variant="outline" onClick={() => navigate("/")}>
            ← Back to Store
          </Button>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-border bg-muted p-4 text-sm">
            {error}
          </div>
        ) : null}

        <div className="mt-8 space-y-4">
          {loading ? (
            <div className="rounded-xl border bg-card p-6">Loading…</div>
          ) : (
            productList.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-4 rounded-xl border bg-card px-5 py-4"
              >
                <div className="font-medium">{p.name}</div>

                <div className="flex items-center gap-3">
                  <input
                    className="w-24 rounded-lg border bg-background px-3 py-2 text-right"
                    type="number"
                    min={0}
                    value={qty[p.id] ?? 0}
                    onChange={(e) =>
                      setQty((prev) => ({
                        ...prev,
                        [p.id]: Number(e.target.value),
                      }))
                    }
                  />
                  <span className="text-sm text-muted-foreground">units</span>
                </div>
              </div>
            ))
          )}
        </div>

        <Button
          className="mt-8 w-full"
          onClick={onSave}
          disabled={loading || saving}
        >
          {saving ? "Saving…" : "Save All Changes"}
        </Button>
      </div>
    </div>
  );
}
