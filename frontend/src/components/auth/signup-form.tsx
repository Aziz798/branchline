import api from "@/api/axios";
import { AUTH_API } from "@/api/base-api-endpoints";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { validateSignupForm } from "@/lib/validators/auth-validations";
import type { SignupFormErrorsType, SignupFormType } from "@/types/auth-types";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
// Removed direct axios import; using shared api instance
import { EyeIcon, EyeOff } from "lucide-react";
import { useState } from "react";

export default function SignupForm(
    { setIsOpen }: { setIsOpen: React.Dispatch<React.SetStateAction<boolean>> },
) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [form, setForm] = useState<SignupFormType>({
        name: "",
        email: "",
        password: "",
        confirm_password: "",
    });
    const [errors, setErrors] = useState<SignupFormErrorsType | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const authContext = useAuth();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const mutation = useMutation({
        mutationKey: ["signup"],
        mutationFn: async (payload: typeof form) =>
            await api.post(
                AUTH_API + "/users/register",
                payload,
            ),
    });
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitError(null);
        const result = validateSignupForm(form);
        if (!result.success) {
            console.log(errors);

            setErrors(result.errors ?? null);
            return;
        }
        setErrors(null);
        setIsSubmitting(true);
        mutation.mutate(form, {
            onSuccess: (respnse) => {
                authContext.setAccessToken(respnse.data.access_token);
                setIsOpen(true);
            },
            onError: (error: any) => {
                if (error.status === 500) {
                    setSubmitError("Something went wrong. Please try again.");
                }
                if (error.status === 409) {
                    setSubmitError("User with this email already exists.");
                    setErrors({
                        email: { errors: ["Email already in use."] },
                    });
                }
                if (error.status === 400) {
                    setErrors(error.response.data.errors);
                }
            },
            onSettled: () => setIsSubmitting(false),
        });
    }
    return (
        <div className={"flex flex-col gap-6"}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">
                        Create your account
                    </CardTitle>
                    <CardDescription>
                        Enter your email below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="w-full">
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">
                                    Full Name
                                </FieldLabel>

                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    autoComplete="name"
                                    name="name"
                                    onChange={handleChange}
                                />
                                {errors?.name && (
                                    <FieldError>
                                        {errors.name.errors[0]}
                                    </FieldError>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    autoComplete="email"
                                    name="email"
                                    onChange={handleChange}
                                />
                            </Field>
                            {errors?.email && (
                                <FieldError>
                                    {errors.email.errors[0]}
                                </FieldError>
                            )}

                            <Field>
                                <Field className="flex gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="password">
                                            Password
                                        </FieldLabel>
                                        <div className="flex gap-1 items-center">
                                            <Input
                                                id="password"
                                                type={showPassword
                                                    ? "text"
                                                    : "password"}
                                                placeholder="********"
                                                autoComplete="new-password"
                                                name="password"
                                                onChange={handleChange}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )}
                                            >
                                                {showPassword
                                                    ? <EyeIcon />
                                                    : <EyeOff />}
                                            </Button>
                                        </div>
                                        {errors?.password && (
                                            <FieldError>
                                                {errors.password
                                                    .errors[0]}
                                            </FieldError>
                                        )}
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="confirm-password">
                                            Confirm Password
                                        </FieldLabel>
                                        <div className="flex gap-1 items-center">
                                            <Input
                                                id="confirm-password"
                                                type={showConfirmPassword
                                                    ? "text"
                                                    : "password"}
                                                placeholder="********"
                                                autoComplete="new-password"
                                                name="confirm_password"
                                                onChange={handleChange}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword,
                                                    )}
                                            >
                                                {showConfirmPassword
                                                    ? <EyeIcon />
                                                    : <EyeOff />}
                                            </Button>
                                        </div>
                                        {errors?.confirm_password &&
                                            (
                                                <FieldError>
                                                    {errors
                                                        .confirm_password
                                                        .errors[0]}
                                                </FieldError>
                                            )}
                                    </Field>
                                </Field>
                                <FieldDescription>
                                    Must be at least 8 characters long.
                                </FieldDescription>
                            </Field>
                            <Field>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting
                                        ? "Creating..."
                                        : "Create Account"}
                                </Button>
                                <button className="gsi-material-button">
                                    <div className="gsi-material-button-state">
                                    </div>
                                    <div className="gsi-material-button-content-wrapper">
                                        <div className="gsi-material-button-icon">
                                            <svg
                                                version="1.1"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 48 48"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                style={{ display: "block" }}
                                            >
                                                <path
                                                    fill="#EA4335"
                                                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                                                >
                                                </path>
                                                <path
                                                    fill="#4285F4"
                                                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                                                >
                                                </path>
                                                <path
                                                    fill="#FBBC05"
                                                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                                                >
                                                </path>
                                                <path
                                                    fill="#34A853"
                                                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                                                >
                                                </path>
                                                <path
                                                    fill="none"
                                                    d="M0 0h48v48H0z"
                                                >
                                                </path>
                                            </svg>
                                        </div>
                                        <span className="gsi-material-button-contents">
                                            Sign up with Google
                                        </span>
                                        <span style={{ display: "none" }}>
                                            Sign up with Google
                                        </span>
                                    </div>
                                </button>
                                {submitError && (
                                    <FieldError className="mt-2 text-center">
                                        {submitError}
                                    </FieldError>
                                )}
                                <FieldDescription className="text-center">
                                    Already have an account?{" "}
                                    <Link to="/">Sign in</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
            <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our{" "}
                <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>.
            </FieldDescription>
        </div>
    );
}
