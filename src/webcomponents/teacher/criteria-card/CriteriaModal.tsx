"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateCriteria } from "@/api/criteria/criteria";

export const CriteriaModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  const { mutate, isPending } = useCreateCriteria();

  const handleSubmit = () => {
    if (!code || !description) return;

    mutate(
      {
        code,
        description,
      },
      {
        onSuccess: () => {
          setCode("");
          setDescription("");
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Create Criteria</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* CODE */}
          <Input
            placeholder="Code (e.g. Ra, 1.1)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          {/* DESCRIPTION */}
          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full"
        >
          {isPending ? "Creating..." : "Create Criteria"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};