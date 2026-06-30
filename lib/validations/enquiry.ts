import { z } from "zod";

export const enquirySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(120, "Name must be under 120 characters")
    .trim(),

  email: z
    .string()
    .email("Please enter a valid email address")
    .max(254)
    .trim()
    .toLowerCase(),

  phone: z
    .string()
    .max(20, "Phone number too long")
    .trim()
    .optional()
    .or(z.literal("")),

  project_type: z.enum(
    ["modular_kitchen", "open_plan", "full_interior", "luxury_kitchen", "other"],
    { errorMap: () => ({ message: "Please select a project type" }) }
  ),

  message: z
    .string()
    .max(2000, "Message must be under 2000 characters")
    .trim()
    .optional()
    .or(z.literal("")),

  source: z.string().max(80).optional(),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
