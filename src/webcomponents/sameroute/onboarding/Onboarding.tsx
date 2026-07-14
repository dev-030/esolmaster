'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useCheckUsernameQuery, useCompleteProfileMutation } from "@/api/auth";

// ─── Zod Schema for Onboarding ───────────────────────────────────────────────

const studentOnboardingSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^\w+$/, "Username can only contain letters, numbers, and underscores"),
});

const teacherOnboardingSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  institution: z.string().min(1, "Institution is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
});

type StudentOnboardingForm = z.infer<typeof studentOnboardingSchema>;
type TeacherOnboardingForm = z.infer<typeof teacherOnboardingSchema>;

// ─── Helper Components ───────────────────────────────────────────────────────

const FormField = ({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <Label htmlFor={id} className="text-sm font-medium text-gray-700">
      {label}
    </Label>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

// ─── Main: Onboarding Component ──────────────────────────────────────────────

export const Onboarding = ({ role }: { role: 'teacher' | 'student' }) => {
  const router = useRouter();
  const isTeacher = role === "teacher";
  console.log("Onboarding role:", role);

  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");

  const { mutateAsync: checkUsername, isPending: isCheckingUsername } = useCheckUsernameQuery();
  const { mutateAsync: completeProfile, isPending: isCompleteProfilePending } = useCompleteProfileMutation();

  // Student form
  const studentForm = useForm<StudentOnboardingForm>({
    resolver: zodResolver(studentOnboardingSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
    },
  });

  // Teacher form
  const teacherForm = useForm<TeacherOnboardingForm>({
    resolver: zodResolver(teacherOnboardingSchema),
    mode: "onChange",
    defaultValues: {
      subject: "",
      institution: "",
      bio: "",
    },
  });

  const studentUsername = studentForm.watch("username");

  // Username availability check (only for students)
  useEffect(() => {
    if (!isTeacher && studentUsername && studentUsername.length >= 3) {
      const delay = setTimeout(async () => {
        try {
          setUsernameStatus("checking");
          const res = await checkUsername(studentUsername);
          if (res.available) {
            setUsernameStatus("available");
          } else {
            setUsernameStatus("taken");
            studentForm.setError("username", {
              type: "manual",
              message: "Username is already taken",
            });
          }
        } catch {
          setUsernameStatus("idle");
        }
      }, 500);

      return () => clearTimeout(delay);
    } else {
      setUsernameStatus("idle");
      studentForm.clearErrors("username");
    }
  }, [studentUsername, isTeacher, checkUsername, studentForm]);

  const onSubmitStudent = async (data: StudentOnboardingForm) => {
    if (usernameStatus !== "available") return;
    
    try {
      await completeProfile({ username: data.username });
      router.push("/dashboard"); // or wherever you want to redirect
    } catch (error) {
      console.error("Complete profile failed:", error);
    }
  };

  const onSubmitTeacher = async (data: TeacherOnboardingForm) => {
    try {
      await completeProfile({
        subject: data.subject,
        institution: data.institution,
        bio: data.bio,
      });
      router.push("/dashboard"); // or wherever you want to redirect
    } catch (error) {
      console.error("Complete profile failed:", error);
    }
  };

  const isSubmitting = isTeacher ? isCompleteProfilePending : (isCompleteProfilePending || isCheckingUsername);
  const isValid = isTeacher 
    ? teacherForm.formState.isValid 
    : (studentForm.formState.isValid && usernameStatus === "available");

  // Student Form UI
  if (!isTeacher) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md px-8 py-12 bg-white rounded-2xl shadow-sm">
          <div className="flex flex-col gap-1 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Complete Your Profile
            </h1>
            <p className="text-sm text-gray-500">
              Choose a unique username to get started
            </p>
          </div>

          <form onSubmit={studentForm.handleSubmit(onSubmitStudent)} className="flex flex-col gap-6">
            <FormField
              id="username"
              label="Username"
              error={studentForm.formState.errors.username?.message}
            >
              <div className="relative">
                <Input
                  id="username"
                  placeholder="john_doe"
                  {...studentForm.register("username")}
                  className="pr-24"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs">
                  {usernameStatus === "checking" && (
                    <span className="text-gray-400">Checking...</span>
                  )}
                  {usernameStatus === "available" && (
                    <span className="text-green-600 font-medium">✓ Available</span>
                  )}
                  {usernameStatus === "taken" && (
                    <span className="text-red-500 font-medium">✗ Taken</span>
                  )}
                </div>
              </div>
            </FormField>

            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="w-full flex items-center gap-2"
            >
              {isSubmitting ? "Completing Profile..." : "Complete Profile"}
              <ArrowRight size={15} />
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Teacher Form UI
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md px-8 py-12 bg-white rounded-2xl shadow-sm">
        <div className="flex flex-col gap-1 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Complete Your Profile
          </h1>
          <p className="text-sm text-gray-500">
            Tell us about your teaching experience
          </p>
        </div>

        <form onSubmit={teacherForm.handleSubmit(onSubmitTeacher)} className="flex flex-col gap-4">
          <FormField
            id="subject"
            label="Subject / Specialization"
            error={teacherForm.formState.errors.subject?.message}
          >
            <Input
              id="subject"
              placeholder="e.g. English Grammar"
              {...teacherForm.register("subject")}
            />
          </FormField>

          <FormField
            id="institution"
            label="Institution / School"
            error={teacherForm.formState.errors.institution?.message}
          >
            <Input
              id="institution"
              placeholder="e.g. Greenfield Academy"
              {...teacherForm.register("institution")}
            />
          </FormField>

          <FormField
            id="bio"
            label="Short Bio"
            error={teacherForm.formState.errors.bio?.message}
          >
            <textarea
              id="bio"
              rows={4}
              placeholder="Tell students a bit about yourself..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0"
              {...teacherForm.register("bio")}
            />
          </FormField>

          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full flex items-center gap-2"
          >
            {isSubmitting ? "Completing Profile..." : "Complete Profile"}
            <ArrowRight size={15} />
          </Button>
        </form>
      </div>
    </div>
  );
};