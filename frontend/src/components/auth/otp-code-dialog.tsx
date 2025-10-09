import api from "@/api/axios";
import { AUTH_API } from "@/api/base-api-endpoints";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";

export default function OtpCodeDialog(
    { isOpen, setIsOpen }: {
        isOpen: boolean;
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    },
) {
    const [otpCode, setOtpCode] = useState("");
    const [error, setError] = useState<string | null>(null);

    const verifyOtpMutation = useMutation({
        mutationKey: ["verify-otp"],
        mutationFn: async () => {
            await api.post(AUTH_API + "/users/verify-email", {
                otp_code: otpCode,
            });
        },
        onSuccess: (data) => {
            console.log("OTP verified", data);
            setOtpCode("");
            setError(null);
            setIsOpen(false); // Close dialog on success
        },
        onError: (error: any) => {
            // Handle different error cases
            if (error.response?.status === 400) {
                setError("Invalid OTP code. Please try again.");
            } else if (error.response?.status === 410) {
                setError("OTP code has expired. Please request a new one.");
            } else {
                setError("Something went wrong. Please try again.");
            }
        },
        onSettled: () => {
            console.log("OTP verification attempt finished");
        },
    });
    const resendOtpMutation = useMutation({
        mutationKey: ["resend-otp"],
        mutationFn: async () => {
            await api.post(AUTH_API + "/users/resend-verification");
        },
        onSuccess: () => {
            console.log("OTP code resent successfully");
        },
        onError: (error) => {
            console.error("Failed to resend OTP code", error);
            setError("Failed to resend OTP code. Please try again.");
        },
    });
    function handleSubmit() { // Remove async
        if (otpCode.length !== 6) {
            setError("Please enter a 6-digit OTP code.");
            return;
        }
        setError(null);
        verifyOtpMutation.mutate();
    }
    function resendEmail() {
        resendOtpMutation.mutate();
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>OTP code</DialogTitle>
                    <DialogDescription>
                        Insert the code sent to your email
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            OTP Code
                        </Label>
                        <InputOTP
                            maxLength={6}
                            value={otpCode}
                            onChange={(value) => {
                                setOtpCode(value);
                                setError(null); // Clear error when user types
                            }}
                        >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                        {error && (
                            <p className="text-sm text-red-600">{error}</p>
                        )}
                    </div>
                </div>
                <DialogFooter className="sm:justify-start">
                    <Button
                        type="button"
                        className="w-full sm:w-auto"
                        onClick={handleSubmit}
                        disabled={verifyOtpMutation.isPending ||
                            otpCode.length !== 6}
                    >
                        {verifyOtpMutation.isPending
                            ? "Verifying..."
                            : "Verify"}
                    </Button>
                    <Button
                        className="w-full sm:w-auto"
                        variant={"link"}
                        onClick={resendEmail}
                        type="button"
                        disabled={verifyOtpMutation.isPending}
                    >
                        Resend code
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
