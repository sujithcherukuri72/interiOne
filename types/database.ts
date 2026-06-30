/**
 * Database type definitions — mirrors the Supabase schema in
 * supabase/migrations/001_initial_schema.sql.
 *
 * Re-generate after schema changes:
 *   npx supabase gen types typescript --project-id <id> > types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      enquiries: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          email: string;
          phone: string | null;
          project_type: EnquiryProjectType;
          message: string | null;
          status: EnquiryStatus;
          source: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          email: string;
          phone?: string | null;
          project_type: EnquiryProjectType;
          message?: string | null;
          status?: EnquiryStatus;
          source?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["enquiries"]["Insert"]>;
      };

      projects: {
        Row: {
          id: string;
          created_at: string;
          slug: string;
          title: string;
          location: string;
          year: number;
          category: string;
          placeholder_color: string;
          image_src: string | null;
          description: string | null;
          status: ProjectStatus;
          sort_order: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          slug: string;
          title: string;
          location: string;
          year: number;
          category: string;
          placeholder_color: string;
          image_src?: string | null;
          description?: string | null;
          status?: ProjectStatus;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
      };

      finish_ranges: {
        Row: {
          id: string;
          label: string;
          description: string;
          sort_order: number;
        };
        Insert: {
          id: string;
          label: string;
          description: string;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["finish_ranges"]["Insert"]>;
      };

      finishes: {
        Row: {
          id: string;
          range_id: string;
          name: string;
          hex: string;
          finish_type: FinishType;
          edge_band_name: string;
          edge_band_hex: string;
          edge_band_finish: EdgeBandFinish;
          sort_order: number;
        };
        Insert: {
          id: string;
          range_id: string;
          name: string;
          hex: string;
          finish_type: FinishType;
          edge_band_name: string;
          edge_band_hex: string;
          edge_band_finish: EdgeBandFinish;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["finishes"]["Insert"]>;
      };

      contact_messages: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          email: string;
          subject: string | null;
          message: string;
          replied: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          email: string;
          subject?: string | null;
          message: string;
          replied?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["contact_messages"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      enquiry_project_type: EnquiryProjectType;
      enquiry_status: EnquiryStatus;
      project_status: ProjectStatus;
      finish_type: FinishType;
      edge_band_finish: EdgeBandFinish;
    };
  };
};

export type EnquiryProjectType =
  | "modular_kitchen"
  | "open_plan"
  | "full_interior"
  | "luxury_kitchen"
  | "other";

export type EnquiryStatus = "new" | "contacted" | "quoted" | "closed_won" | "closed_lost";
export type ProjectStatus  = "published" | "draft" | "archived";
export type FinishType     = "Solid Matte" | "Metallic" | "Wood" | "Gloss" | "Concrete";
export type EdgeBandFinish = "Satin" | "Metallic" | "Matte";

/* Convenience row type aliases */
export type EnquiryRow       = Database["public"]["Tables"]["enquiries"]["Row"];
export type ProjectRow       = Database["public"]["Tables"]["projects"]["Row"];
export type FinishRangeRow   = Database["public"]["Tables"]["finish_ranges"]["Row"];
export type FinishRow        = Database["public"]["Tables"]["finishes"]["Row"];
export type ContactMessageRow = Database["public"]["Tables"]["contact_messages"]["Row"];
