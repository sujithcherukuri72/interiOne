import { createClient } from "@/lib/supabase/server";
import type { ProjectRow } from "@/types/database";

/** All published projects ordered by sort_order. */
export async function getPublishedProjects(): Promise<ProjectRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Single project by slug — returns null if not found or not published. */
export async function getProjectBySlug(
  slug: string
): Promise<ProjectRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) return null;
  return data;
}
