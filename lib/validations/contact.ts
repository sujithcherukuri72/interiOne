import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(120)
    .trim(),

  email: z
    .string()
    .email("Please enter a valid email address")
    .max(254)
    .trim()
    .toLowerCase(),

  subject: z
    .string()
    .max(200)
    .trim()
    .optional()
    .or(z.literal("")),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be under 5000 characters")
    .trim(),
});

export type ContactInput = z.infer<typeof contactSchema>;
