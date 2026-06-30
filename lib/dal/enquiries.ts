import { createClient } from "@/lib/supabase/server";
import type { Database, EnquiryRow } from "@/types/database";

type EnquiryInsert = Database["public"]["Tables"]["enquiries"]["Insert"];

/** Persist a new lead enquiry. Returns the created row. */
export async function createEnquiry(
  payload: Omit<EnquiryInsert, "id" | "created_at" | "status">
): Promise<EnquiryRow> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("enquiries")
    .insert({ ...payload, status: "new" })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** List all enquiries (admin only — enforced by RLS). */
export async function listEnquiries(
  status?: EnquiryRow["status"]
): Promise<EnquiryRow[]> {
  const supabase = await createClient();
  let query = supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}
