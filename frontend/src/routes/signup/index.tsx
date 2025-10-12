import OtpCodeDialog from "@/components/auth/otp-code-dialog";
import SignupForm from "@/components/auth/signup-form";
import { Navbar } from "@/components/shared/footer";
import { createFileRoute } from "@tanstack/react-router";
import { GalleryVerticalEnd } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/signup/")({
  component: SignupPage,
});

function SignupPage() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Navbar />
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a
            href="#"
            className="flex items-center gap-2 self-center font-medium"
          >
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </a>
          <SignupForm setIsOpen={setIsOpen} />
        </div>
      </div>
      <OtpCodeDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
