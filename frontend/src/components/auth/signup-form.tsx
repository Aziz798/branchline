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
import GoogleLoginButton from "./google-login-button";

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
                                <GoogleLoginButton buttonText="sign up" />
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
