/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useRouter } from "next/navigation";
import { GraduationCap, Mail, Lock, Loader2, Users, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useState } from "react";
import { useSignInMutation } from "@/api/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showRoleDialog, setShowRoleDialog] = useState(false);
   
  const { mutateAsync: signIn, isPending } = useSignInMutation();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signIn({ email, password });
      toast.success("Login successful!");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error("Invalid credentials");
    }
  };

  // Google Login Logic
  const handleGoogleLogin = (role: "student" | "teacher") => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
    
    // Construct the state object as your backend expects
    const state = encodeURIComponent(JSON.stringify({ role }));
    
    // Redirect to backend
    window.location.href = `${backendUrl}/auth/google?state=${state}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
            <GraduationCap className="text-primary w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 text-sm">Login to Continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email Address</label>
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

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <button
                type="button"
                className="text-xs font-semibold text-primary hover:underline"
                onClick={() => router.push("/forgot-password")}
              >
                Forget Password?
              </button>
            </div>
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

          <div className="flex items-center space-x-2 py-2">
            <Checkbox id="remember" />
            <label htmlFor="remember" className="text-xs font-medium text-slate-600">Remember me</label>
          </div>

          <Button type="submit" className="w-full h-11" disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin mr-2" /> : "Login"}
          </Button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* GOOGLE BUTTON - Triggers Role Dialog */}
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={() => setShowRoleDialog(true)}
            >
              Google
            </Button>
            <Button type="button" variant="outline" className="w-full">
              Apple
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-slate-500 mt-8">
          Don&apos;t have an account?{" "}
          <span className="text-primary font-bold cursor-pointer hover:underline" onClick={()=>router.push('/register')}>Sign Up</span>
        </p>
      </div>

      {/* Role Selection Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Continue as...</DialogTitle>
            <DialogDescription className="text-center">
              Please select your role to personalize your experience.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <button
              onClick={() => handleGoogleLogin("student")}
              className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-slate-100 hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/10">
                <School className="w-6 h-6 text-slate-600 group-hover:text-primary" />
              </div>
              <span className="font-bold text-slate-700">Student</span>
            </button>

            <button
              onClick={() => handleGoogleLogin("teacher")}
              className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-slate-100 hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/10">
                <Users className="w-6 h-6 text-slate-600 group-hover:text-primary" />
              </div>
              <span className="font-bold text-slate-700">Teacher</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};