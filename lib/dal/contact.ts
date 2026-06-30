import { createClient } from "@/lib/supabase/server";
import type { ContactMessageRow, Database } from "@/types/database";

type ContactInsert = Database["public"]["Tables"]["contact_messages"]["Insert"];

/** Persist a contact message from the contact page form. */
export async function createContactMessage(
  payload: Omit<ContactInsert, "id" | "created_at" | "replied">
): Promise<ContactMessageRow> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .insert({ ...payload, replied: false })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
