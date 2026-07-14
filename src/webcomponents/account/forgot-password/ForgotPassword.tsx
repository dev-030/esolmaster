"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  KeyRound,
  Loader2,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useVerifyResetCodeMutation,
} from "@/api/auth";

type Step = "email" | "code" | "password";

export const ForgotPassword = () => {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { mutateAsync: forget, isPending: sending } =
    useForgetPasswordMutation();
  const { mutateAsync: verify, isPending: verifying } =
    useVerifyResetCodeMutation();
  const { mutateAsync: reset, isPending: resetting } =
    useResetPasswordMutation();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forget(email);
      toast.success("If the email exists, a code has been sent.");
      setStep("code");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length !== 6) {
      toast.error("Enter the 6-digit code from your email.");
      return;
    }
    try {
      const res = await verify({ email, code: code.trim() });
      setResetToken(res.resetToken);
      toast.success("Code verified. Set a new password.");
      setStep("password");
    } catch {
      toast.error("Invalid or expired code.");
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      await reset({ password, confirmPassword, resetToken });
      toast.success("Password reset successful. Please log in.");
      router.push("/login");
    } catch {
      toast.error("Reset link expired. Please start again.");
      setStep("email");
    }
  };

  const resend = async () => {
    try {
      await forget(email);
      toast.success("A new code has been sent.");
    } catch {
      toast.error("Could not resend the code.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
            {step === "email" && <Mail className="text-primary w-7 h-7" />}
            {step === "code" && <ShieldCheck className="text-primary w-7 h-7" />}
            {step === "password" && <Lock className="text-primary w-7 h-7" />}
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {step === "email" && "Forgot Password"}
            {step === "code" && "Enter Verification Code"}
            {step === "password" && "Set a New Password"}
          </h1>
          <p className="text-slate-500 text-sm">
            {step === "email" &&
              "Enter your email and we'll send you a reset code."}
            {step === "code" && (
              <>
                We sent a 6-digit code to{" "}
                <span className="font-semibold text-slate-700">{email}</span>
              </>
            )}
            {step === "password" && "Choose a strong password you'll remember."}
          </p>
        </div>

        {/* Step 1: email */}
        {step === "email" && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 h-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-11" disabled={sending}>
              {sending ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                "Send Reset Code"
              )}
            </Button>
          </form>
        )}

        {/* Step 2: code */}
        {step === "code" && (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Verification Code
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="6-digit code"
                  className="pl-10 h-11 tracking-[0.4em] text-center font-semibold"
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-11" disabled={verifying}>
              {verifying ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                "Verify Code"
              )}
            </Button>
            <div className="flex justify-between text-xs">
              <button
                type="button"
                className="text-slate-500 hover:underline"
                onClick={() => setStep("email")}
              >
                Change email
              </button>
              <button
                type="button"
                className="text-primary font-semibold hover:underline disabled:opacity-50"
                onClick={resend}
                disabled={sending}
              >
                Resend code
              </button>
            </div>
          </form>
        )}

        {/* Step 3: new password */}
        {step === "password" && (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-11"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-11" disabled={resetting}>
              {resetting ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        )}

        <button
          type="button"
          onClick={() => router.push("/login")}
          className="mt-8 mx-auto flex items-center gap-1 text-sm text-slate-500 hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4" /> Back to login
        </button>
      </div>
    </div>
  );
};
