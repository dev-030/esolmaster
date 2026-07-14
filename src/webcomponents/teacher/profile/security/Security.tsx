"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PasswordStrengthBar } from "@/webcomponents/reusable";
import { toast } from "sonner";
import { useChangePasswordMutation } from "@/api/auth";


export const Security = () => {
  const { mutateAsync: changePassword, isPending } = useChangePasswordMutation();

  const [fields, setFields] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [show, setShow] = useState({
    current: false,
    newPass: false,
    confirm: false,
  });

  const handleChange = (field: keyof typeof fields) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setFields((prev) => ({ ...prev, [field]: e.target.value }));

  const toggleShow = (field: keyof typeof show) =>
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  const renderEye = (field: keyof typeof show) => (
    <button
      type="button"
      onClick={() => toggleShow(field)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
    >
      {show[field] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );

  const handleCancel = () =>
    setFields({ current: "", newPass: "", confirm: "" });

  const handleUpdate = async () => {
    if (!fields.current) {
      toast.error("Enter your current password");
      return;
    }
    if (fields.newPass.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (fields.newPass !== fields.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await changePassword({
        currentPassword: fields.current,
        newPassword: fields.newPass,
        confirmPassword: fields.confirm,
      });
      toast.success("Password updated");
      handleCancel();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to update password";
      toast.error(message);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="px-6 py-4">
        <CardTitle className="text-base font-semibold">Change Password</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6 space-y-4">
        {/* Current Password */}
        <div className="space-y-1.5">
          <Label htmlFor="current">Current Password</Label>
          <div className="relative">
            <Input
              id="current"
              type={show.current ? "text" : "password"}
              value={fields.current}
              onChange={handleChange("current")}
              placeholder="Enter current password"
              className="pr-10"
            />
            {renderEye("current")}
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-1.5">
          <Label htmlFor="newPass">New Password</Label>
          <div className="relative">
            <Input
              id="newPass"
              type={show.newPass ? "text" : "password"}
              value={fields.newPass}
              onChange={handleChange("newPass")}
              placeholder="Enter new password"
              className="pr-10"
            />
            {renderEye("newPass")}
          </div>
          <PasswordStrengthBar password={fields.newPass} />
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <Label htmlFor="confirm">Confirm New Password</Label>
          <div className="relative">
            <Input
              id="confirm"
              type={show.confirm ? "text" : "password"}
              value={fields.confirm}
              onChange={handleChange("confirm")}
              placeholder="Confirm new password"
              className="pr-10"
            />
            {renderEye("confirm")}
          </div>
          {fields.confirm && fields.newPass !== fields.confirm && (
            <p className="text-xs text-red-500 mt-1">Passwords do not match.</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={handleCancel} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={isPending} className="gap-2">
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Update Password
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
