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
import { validateSignupForm } from "@/lib/validators/auth-validations";
import type { SignupFormErrorsType, SignupFormType } from "@/types/auth-types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { EyeIcon, EyeOff } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

export default function SignupForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [form, setForm] = useState<SignupFormType>({
        name: "",
        email: "",
        password: "",
        confirm_password: "",
    });
    const [errors, setErrors] = useState<SignupFormErrorsType | null>(null);
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const mutation = useMutation({
        mutationFn: (payload: typeof form) =>
            axios.post(
                "http://localhost:8080/api/v1/auth-service/register",
                payload,
            ),
    });
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const result = validateSignupForm(form);
        if (!result.success) {
            setErrors(result.errors);
            return;
        }
        setErrors(null);
        mutation.mutate(form);
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
                                <Button type="submit">Create Account</Button>
                                <FieldDescription className="text-center">
                                    Already have an account?{" "}
                                    <a href="#">Sign in</a>
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
