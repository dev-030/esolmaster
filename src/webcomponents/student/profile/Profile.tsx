"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Pencil, Save, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import {
  useChangePasswordMutation,
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
} from "@/api/auth";

// --- Schemas ---
const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

export const Profile = () => {
  const [editing, setEditing] = React.useState(false);
  const [showPw, setShowPw] = React.useState({
    current: false,
    new: false,
    confirm: false,
  });

  const { data: profile, isLoading } = useGetMyProfileQuery();
  const { mutateAsync: updateProfile, isPending: savingProfile } =
    useUpdateMyProfileMutation();
  const { mutateAsync: changePassword, isPending: savingPassword } =
    useChangePasswordMutation();

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    values: {
      firstName: profile?.firstName ?? "",
      lastName: profile?.lastName ?? "",
    },
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onProfileSave = async (values: ProfileValues) => {
    try {
      await updateProfile(values);
      toast.success("Profile updated");
      setEditing(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const onPasswordSave = async (values: PasswordValues) => {
    try {
      await changePassword(values);
      toast.success("Password updated");
      passwordForm.reset();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to update password";
      toast.error(message);
    }
  };

  const togglePw = (field: keyof typeof showPw) =>
    setShowPw((p) => ({ ...p, [field]: !p[field] }));

  const fullName = `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim();

  return (
    <div className="p-6 space-y-6">
      {/* Heading Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Profile</h2>
        <Button
          type="button"
          disabled={isLoading || savingProfile}
          onClick={() =>
            editing
              ? profileForm.handleSubmit(onProfileSave)()
              : setEditing(true)
          }
          className="gap-2"
        >
          {savingProfile ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : editing ? (
            <Save className="w-4 h-4" />
          ) : (
            <Pencil className="w-4 h-4" />
          )}
          {editing ? "Save Profile" : "Edit Profile"}
        </Button>
      </div>

      <div className="rounded-2xl border border-border p-6 space-y-6 bg-[#F9FBFF]">
        {/* Avatar Section */}
        <div className="flex items-center gap-5">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-sm bg-muted flex items-center justify-center">
            <span className="text-3xl font-bold text-muted-foreground">
              {profile?.firstName?.charAt(0)?.toUpperCase() ?? "?"}
            </span>
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">
              {fullName || "—"}
            </p>
            <p className="text-sm text-muted-foreground">
              {profile?.email}
              {profile?.username ? ` — @${profile.username}` : ""}
            </p>
          </div>
        </div>

        {/* Profile Form */}
        <form
          id="profile-form"
          onSubmit={profileForm.handleSubmit(onProfileSave)}
        >
          <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              name="firstName"
              control={profileForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>First Name</FieldLabel>
                  <Input {...field} disabled={!editing} placeholder="First name" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="lastName"
              control={profileForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Last Name</FieldLabel>
                  <Input {...field} disabled={!editing} placeholder="Last name" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input value={profile?.email ?? ""} disabled />
            </Field>
          </FieldGroup>
        </form>

        <div className="space-y-1">
          <Separator />
          <p className="text-xs font-semibold text-muted-foreground pt-1 uppercase tracking-wider">
            Change Password
          </p>
        </div>

        {/* Password Form */}
        <form
          id="password-form"
          onSubmit={passwordForm.handleSubmit(onPasswordSave)}
        >
          <FieldGroup className="space-y-4">
            {(
              ["currentPassword", "newPassword", "confirmPassword"] as const
            ).map((fieldName) => {
              const labels: Record<string, string> = {
                currentPassword: "Current Password",
                newPassword: "New Password",
                confirmPassword: "Confirm Password",
              };
              const showKey =
                fieldName === "currentPassword"
                  ? "current"
                  : fieldName === "newPassword"
                    ? "new"
                    : "confirm";

              return (
                <Controller
                  key={fieldName}
                  name={fieldName}
                  control={passwordForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>{labels[fieldName]}</FieldLabel>
                      <InputGroup>
                        <Input
                          {...field}
                          type={
                            showPw[showKey as keyof typeof showPw]
                              ? "text"
                              : "password"
                          }
                          placeholder="••••••••"
                        />
                        <InputGroupAddon>
                          <button
                            type="button"
                            onClick={() =>
                              togglePw(showKey as keyof typeof showPw)
                            }
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPw[showKey as keyof typeof showPw] ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </InputGroupAddon>
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              );
            })}

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                form="password-form"
                disabled={savingPassword}
                className="gap-2"
              >
                {savingPassword ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Password
              </Button>
            </div>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
};
