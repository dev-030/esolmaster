/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PasswordStrengthBar } from "@/webcomponents/reusable";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Chrome,
  Apple,
} from "lucide-react";
import { useCheckUsernameQuery, useSignUpMutation } from "@/api/auth";
import { LeftPanel } from "./LeftPanel";
import { FormField } from "./FormField";

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

const baseSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
  agreed: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms" }),
  }),
});

const teacherSchema = baseSchema.extend({
  role: z.literal("teacher"),
  subject: z.string().min(1, "Subject is required"),
  institution: z.string().min(1, "Institution is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
});

const studentSchema = baseSchema.extend({
  role: z.literal("student"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(
      /^\w+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
});

const formSchemaBase = z.discriminatedUnion("role", [
  teacherSchema,
  studentSchema,
]);

export const formSchema = formSchemaBase.superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });
  }
});

type FormValues = z.infer<typeof formSchema>;

type TeacherForm = z.infer<typeof teacherSchema>;
type StudentForm = z.infer<typeof studentSchema>;
// ─── Helpers ──────────────────────────────────────────────────────────────────

// ─── Left Panel ───────────────────────────────────────────────────────────────

// ─── Main: SignUp ─────────────────────────────────────────────────────────────

export const SignUp = () => {
  const router = useRouter();
  const [role, setRole] = useState<"student" | "teacher" | null>(null);
  const isTeacher = role === "teacher";

  const [showPw, setShowPw] = useState(false);
  const [password, setPassword] = useState("");
  const { mutateAsync: signUp, isPending } = useSignUpMutation();
  const {
    mutateAsync: checkUsername,
    isPending: isCheckingUsername,
    data,
  } = useCheckUsernameQuery();
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");
  // pick schema based on role

  useEffect(() => {
    const storedRole = localStorage.getItem("role") as
      | "student"
      | "teacher"
      | null;
    setRole(storedRole);
  }, []);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    shouldUnregister: true,
    defaultValues: {
      role: isTeacher ? "teacher" : "student",
      agreed: true,
    },
  });

  useEffect(() => {
    setValue("role", role as "teacher" | "student", {
      shouldValidate: true,
    });
  }, [role, setValue]);

  const agreed = watch("agreed" as any);

  const username = watch("username");

  useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameStatus("idle");
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setUsernameStatus("checking");

        const res = await checkUsername(username);

        if (res.available) {
          setUsernameStatus("available");
        } else {
          setUsernameStatus("taken");
        }
      } catch {
        setUsernameStatus("idle");
      }
    }, 500); // debounce

    return () => clearTimeout(delay);
  }, [username]);

  const onError = (errors: any) => {
    console.log("FORM ERRORS:", errors);
  };

  const onSubmit = async (data: FormValues) => {
    console.log("Submit", data);

    const { confirmPassword, ...payload } = data;
    console.log(confirmPassword);

    try {
      await signUp(payload);
      router.push("/login");
    } catch (e) {
      console.error("Sign up failed", e);
      return;
    }

    // handle sign up
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left decorative panel */}
      <LeftPanel role={role as "student" | "teacher"} />

      {/* Right form panel */}
      <div className="w-full md:w-1/2 h-full overflow-y-hidden flex items-start justify-center">
        <div className="w-full max-w-md px-8 py-12 flex flex-col gap-5">
          {/* Back button */}
          <button
            onClick={() => router.push("/register")}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors w-fit"
          >
            <ArrowLeft size={15} />
            Back to role selection
          </button>

          {/* Signing up as */}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-gray-900">
              Create an Account
            </h1>
            <p className="text-sm text-gray-500">
              Signing up as{" "}
              <span className="text-indigo-600 font-semibold capitalize">
                {role}
              </span>
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="flex flex-col gap-4"
          >
            {/* First + Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                id="firstName"
                label="First Name"
                error={errors.firstName?.message}
              >
                <Input
                  id="firstName"
                  placeholder="John"
                  {...register("firstName")}
                />
              </FormField>
              <FormField
                id="lastName"
                label="Last Name"
                error={errors.lastName?.message}
              >
                <Input
                  id="lastName"
                  placeholder="Doe"
                  {...register("lastName")}
                />
              </FormField>
            </div>
            {role === "student" && (
              <FormField
                id="username"
                label="Username"
                error={(errors as FieldErrors<StudentForm>).username?.message}
              >
                <div className="relative">
                  <Input
                    id="username"
                    placeholder="john_doe"
                    {...register("username")}
                    className="pr-24"
                  />

                  {/* Status Indicator */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs">
                    {usernameStatus === "checking" && (
                      <span className="text-gray-400">Checking...</span>
                    )}
                    {usernameStatus === "available" && (
                      <span className="text-green-600 font-medium">
                        ✓ Available
                      </span>
                    )}
                    {usernameStatus === "taken" && (
                      <span className="text-red-500 font-medium">✗ Taken</span>
                    )}
                  </div>
                </div>
              </FormField>
            )}

            {/* Email */}
            <FormField
              id="email"
              label="Email Address"
              error={errors.email?.message}
            >
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register("email")}
              />
            </FormField>
            <input type="hidden" {...register("role")} value={role as string} />

            {role === "teacher" && (
              <>
                <FormField
                  id="subject"
                  label="Subject / Specialization"
                  error={(errors as FieldErrors<TeacherForm>).subject?.message}
                >
                  <Input
                    id="subject"
                    placeholder="e.g. English Grammar"
                    {...register("subject" as any)}
                  />
                </FormField>

                <FormField
                  id="institution"
                  label="Institution / School"
                  error={
                    (errors as FieldErrors<TeacherForm>).institution?.message
                  }
                >
                  <Input
                    id="institution"
                    placeholder="e.g. Greenfield Academy"
                    {...register("institution" as any)}
                  />
                </FormField>

                <FormField
                  id="bio"
                  label="Short Bio"
                  error={(errors as FieldErrors<TeacherForm>).bio?.message}
                >
                  <textarea
                    id="bio"
                    rows={3}
                    placeholder="Tell students a bit about yourself..."
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0"
                    {...register("bio" as any)}
                  />
                </FormField>
              </>
            )}

            {/* Password */}
            <FormField
              id="password"
              label="Password"
              error={errors.password?.message}
            >
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  className="pr-10"
                  {...register("password", {
                    onChange: (e) => {
                      setPassword(e.target.value);
                      trigger("confirmPassword");
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {password && <PasswordStrengthBar password={password} />}
            </FormField>

            <FormField
              id="confirmPassword"
              label="Confirm Password"
              error={errors.confirmPassword?.message}
            >
              <Input
                id="confirmPassword"
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                {...register("confirmPassword")}
              />
            </FormField>

            {/* Teacher-only fields */}

            {/* Terms */}
            <div className="flex flex-col gap-1">
              <div className="flex items-start gap-2.5">
                <Checkbox
                  id="agreed"
                  checked={!!agreed}
                  onCheckedChange={(checked) =>
                    setValue(
                      "agreed" as any,
                      checked === true ? true : (undefined as any),
                      { shouldValidate: true },
                    )
                  }
                  className="mt-0.5"
                />
                <label
                  htmlFor="agreed"
                  className="text-sm text-gray-600 cursor-pointer leading-snug"
                >
                  I agree to the{" "}
                  <span className="text-indigo-600 hover:underline cursor-pointer font-medium">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-indigo-600 hover:underline cursor-pointer font-medium">
                    Privacy Policy
                  </span>
                </label>
              </div>
              {(errors as any).agreed && (
                <p className="text-xs text-red-500 pl-6">
                  {(errors as any).agreed.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting || isPending}
              className="w-full flex items-center gap-2"
            >
              {isPending ? "Creating Account..." : "Create an Account"}
              <ArrowRight size={15} />
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 shrink-0">
              or continue with
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Social buttons */}
          <div className="flex flex-col gap-2.5">
            <button className="flex items-center justify-center gap-2.5 w-full border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Chrome size={17} className="text-blue-500" />
              Continue with Google
            </button>
            <button className="flex items-center justify-center gap-2.5 w-full border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Apple size={17} className="text-gray-800" />
              Continue with Apple
            </button>
          </div>

          {/* Login redirect */}
          <p className="text-sm text-center text-gray-500">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-indigo-600 font-medium hover:underline"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
