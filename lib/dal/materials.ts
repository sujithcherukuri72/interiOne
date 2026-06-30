import { createClient } from "@/lib/supabase/server";
import type { FinishRangeRow, FinishRow } from "@/types/database";

export type FinishRangeWithFinishes = FinishRangeRow & {
  finishes: FinishRow[];
};

/** All finish ranges with their nested finishes — public, cached at edge. */
export async function getFinishRanges(): Promise<FinishRangeWithFinishes[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("finish_ranges")
    .select("*, finishes(*)")
    .order("sort_order", { ascending: true })
    .order("sort_order", { ascending: true, referencedTable: "finishes" });

  if (error) throw new Error(error.message);
  return (data ?? []) as FinishRangeWithFinishes[];
}

/** Single finish range by id ('signature' | 'premier' | 'select'). */
export async function getFinishRange(
  id: string
): Promise<FinishRangeWithFinishes | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("finish_ranges")
    .select("*, finishes(*)")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as FinishRangeWithFinishes;
}
