import type { SignupFormErrorsType, SignupFormType } from "@/types/auth-types";
import { z } from "zod";

/**
 * validateSignupForm
 *
 * Validate a signup form object and return a normalized validation result.
 *
 * Validation rules:
 * - name: must be a string with minimum length 2 ("Name is too short").
 * - email: must be a valid email ("Invalid email address").
 * - password: must be a string with minimum length 8 ("Password must be at least 8 characters").
 * - confirm_password: must be a string with minimum length 8 ("Password must be at least 8 characters").
 * - password and confirm_password must match; if they do not, a cross-field error is added on `confirm_password`
 *   with message "Passwords do not match".
 *
 * The function constructs a Zod schema, calls safeParse(form), and on failure uses Zod's flatten()
 * to extract field-level errors. Those errors are mapped to the project's SignupFormErrorsType shape:
 * { field?: { errors: string[] } }.
 *
 * @param form - The signup form object to validate (expected shape: SignupFormType).
 * @returns
 *   - { success: true } when validation succeeds.
 *   - { success: false; errors: SignupFormErrorsType } when validation fails. `errors` contains
 *     only fields that have validation messages, each mapped to an object with an `errors` array.
 *
 * @example
 * const result = validateSignupForm({
 *   name: "Alice",
 *   email: "alice@example.com",
 *   password: "supersecret",
 *   confirm_password: "supersecret"
 * });
 * // => { success: true }
 *
 * @remarks
 * - No exceptions are thrown for validation errors; all validation feedback is returned in the result.
 * - Uses Zod's superRefine for cross-field validation (password match).
 */
export function validateSignupForm(
    form: SignupFormType,
):
    | { success: true }
    | { success: false; errors: SignupFormErrorsType } {
    const schema = z
        .object({
            name: z.string().min(2, "Name is too short"),
            email: z.email("Invalid email address"),
            password: z.string().min(
                8,
                "Password must be at least 8 characters",
            ),
            confirm_password: z.string().min(
                8,
                "Password must be at least 8 characters",
            ),
        })
        .superRefine((data, ctx) => {
            if (data.password !== data.confirm_password) {
                ctx.addIssue({
                    code: "custom",
                    message: "Passwords do not match",
                    path: ["confirm_password"],
                });
            }
        });

    const result = schema.safeParse(form);
    if (!result.success) {
        const errors = z.treeifyError(result.error).properties;
        return { success: false, errors };
    }
    return { success: true };
}
