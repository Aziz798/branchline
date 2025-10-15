import LoginForm from "@/components/auth/login-form";
import OtpCodeDialog from "@/components/auth/otp-code-dialog";
import { Navbar } from "@/components/shared/navbar";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/login/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Navbar />
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm setIsOpen={setIsOpen} />
        </div>
      </div>
      <OtpCodeDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
