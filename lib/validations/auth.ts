import { z } from "zod";

export const signupEmailSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
});

export type SignupEmail = z.infer<typeof signupEmailSchema>;
