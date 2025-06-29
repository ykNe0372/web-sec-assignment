import { z } from "zod";
import {
  userNameSchema,
  emailSchema,
  passwordSchema,
} from "@/app/_types/CommonSchemas";

export const signupRequestSchema = z
.object({
  name: userNameSchema,
  email: emailSchema,
  password: passwordSchema,
  passwordConfirm: passwordSchema,
})
.refine((data) => data.password === data.passwordConfirm, {
  message: "パスワードが一致しません",
  path: ["password"],
})

export type SignupRequest = z.infer<typeof signupRequestSchema>;
