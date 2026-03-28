
import { z } from "zod";

export const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters"
  }),
  email: z.string().email({
    message: "Please enter a valid email address"
  }),
  tier: z.string().min(1, {
    message: "Please select a tier"
  }),
  motivation: z.string().max(600, {
    message: "Message must not exceed 600 characters"
  }).min(10, {
    message: "Please tell us more about yourself (at least 10 characters)"
  })
});

export type FormValues = z.infer<typeof formSchema>;

export const tierOptions = [
  { value: "glow", label: "Glow (Tier 4) – Field Operations" },
  { value: "bridge", label: "Bridge (Tier 3) – Team Leaders" },
  { value: "drive", label: "Drive (Tier 2) – Strategic Expansion" },
  { value: "summit", label: "Summit (Tier 1) – Advisory" }
];
