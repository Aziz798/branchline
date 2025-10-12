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
import { cn } from "@/lib/utils";
import { validateLoginForm } from "@/lib/validators/auth-validations";
import { type LoginFormErrorsType } from "@/types/auth-types";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { EyeIcon, EyeOff } from "lucide-react";
import { useState } from "react";
import GoogleLoginButton from "./google-login-button";

export default function LoginForm(
    { setIsOpen }: { setIsOpen: React.Dispatch<React.SetStateAction<boolean>> },
) {
    const [logindata, setLoginData] = useState({
        email: "",
        password: "",
    });
    const [formErrors, setFormErrors] = useState<LoginFormErrorsType | null>(
        null,
    );
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const authContext = useAuth();
    const navigate = useNavigate();
    const mutation = useMutation({
        mutationKey: ["login-with-password"],
        mutationFn: async (payload: typeof logindata) =>
            await api.post(
                AUTH_API + "/users/login",
                payload,
            ),
    });
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setLoginData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormErrors(null);
        setSubmitError(null);
        const formValidation = validateLoginForm(logindata);
        if (!formValidation.success) {
            setFormErrors(formValidation.errors);
            return;
        }
        mutation.mutate(logindata, {
            onSuccess: (data) => {
                authContext.setAccessToken(data.data.access_token);
                navigate({ to: "/dashboard" });
            },
            onError: async (error: any) => {
                console.log(error.status);
                if (error.response.status === 400) {
                    setFormErrors(error.response.data.errors);
                    return;
                }
                if (error.response.status === 403) {
                    setIsOpen(true);
                    setSubmitError("Please verify your email to login.");
                    await api.post(AUTH_API + "/users/resend-verification");

                    return;
                }
                if (error.response.status === 409) {
                    console.log(error.response);
                    setSubmitError(error.response.data.error);
                    return;
                }
                if (error.response.status === 500) {
                    setSubmitError("Something went wrong. Please try again.");
                    return;
                }
                setSubmitError("Something went wrong. Please try again.");
            },
        });
    }
    return (
        <div className={cn("flex flex-col gap-6")}>
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                        {submitError && (
                            <FieldError className="mt-2 text-center">
                                {submitError}
                            </FieldError>
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    name="email"
                                    value={logindata.email}
                                    onChange={handleChange}
                                />
                                {formErrors?.email && (
                                    <FieldError>
                                        {formErrors.email.errors[0]}
                                    </FieldError>
                                )}
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">
                                        Password
                                    </FieldLabel>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
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
                                        onClick={() => setShowPassword(
                                            !showPassword,
                                        )}
                                    >
                                        {showPassword
                                            ? <EyeIcon />
                                            : <EyeOff />}
                                    </Button>
                                </div>
                                {formErrors?.password && (
                                    <FieldError>
                                        {formErrors.password.errors[0]}
                                    </FieldError>
                                )}
                            </Field>
                            <Field>
                                <Button
                                    type="submit"
                                    disabled={mutation.isPending}
                                >
                                    {mutation.isPending
                                        ? "Creating..."
                                        : "Create Account"}
                                </Button>
                                <GoogleLoginButton buttonText="sign in" />
                                <FieldDescription className="text-center">
                                    Don&apos;t have an account?{" "}
                                    <a href="#">Sign up</a>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
