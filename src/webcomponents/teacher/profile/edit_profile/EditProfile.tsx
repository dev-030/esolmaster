"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useGetMyProfileQuery, useUpdateMyProfileMutation } from "@/api/auth";

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

export const EditProfile = () => {
  const { data: profile, isLoading } = useGetMyProfileQuery();
  const { mutateAsync: updateProfile, isPending: saving } =
    useUpdateMyProfileMutation();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    institution: "",
  });

  useEffect(() => {
    if (profile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        institution: profile.teacherProfile?.institution ?? "",
      });
    }
  }, [profile]);

  const fullName = `${form.firstName} ${form.lastName}`.trim();

  const handleChange =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleReset = () => {
    if (!profile) return;
    setForm({
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      institution: profile.teacherProfile?.institution ?? "",
    });
  };

  const handleSave = async () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error("First and last name are required");
      return;
    }
    try {
      await updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        institution: form.institution,
      });
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-6">
        {/* Avatar + Info */}
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 bg-primary">
            <AvatarFallback className="bg-primary text-white font-semibold text-lg">
              {getInitials(fullName) || "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-base">{fullName || "—"}</p>
            <p className="text-sm text-muted-foreground">Teacher</p>
          </div>
        </div>

        <Separator />

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={form.firstName}
                disabled={isLoading}
                onChange={handleChange("firstName")}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={form.lastName}
                disabled={isLoading}
                onChange={handleChange("lastName")}
              />
            </div>
          </div>

          {/* Email (read-only — changing email needs a verification flow) */}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" value={profile?.email ?? ""} disabled />
          </div>

          {/* Institution */}
          <div className="space-y-1.5">
            <Label htmlFor="institution">Institution / School</Label>
            <Input
              id="institution"
              value={form.institution}
              disabled={isLoading}
              onChange={handleChange("institution")}
            />
          </div>
        </div>

        <div className="pt-2">
          <Separator className="mb-4" />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={handleReset} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
