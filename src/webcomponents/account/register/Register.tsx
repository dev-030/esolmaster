"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  BookOpen,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRole } from "@/provider/RoleProvider";

// ─── Types ────────────────────────────────────────────────────────────────────

type RoleOption = "student" | "teacher";

interface RoleCard {
  role: RoleOption;
  label: string;
  description: string;
  icon: React.ReactNode;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const roleCards: RoleCard[] = [
  {
    role: "student",
    label: "Learner",
    description:
      "Access lessons, complete tasks, and track your learning progress.",
    icon: <GraduationCap size={28} />,
  },
  {
    role: "teacher",
    label: "Teacher",
    description:
      "Create tasks, manage students, and monitor their performance.",
    icon: <BookOpen size={28} />,
  },
];

// ─── Main: Register ───────────────────────────────────────────────────────────

export const Register = () => {
  const router = useRouter();
  const [selected, setSelected] = useState<RoleOption | null>("student");

  const heading =
    selected === "teacher"
      ? "Shape the Learning Experience"
      : "Join the Learning Experience";

  const handleContinue = () => {
    localStorage.setItem("role", selected!);
    if (!selected) return;
    router.push("/signup");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="flex flex-col items-center gap-6 w-full">
        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-50">
          <GraduationCap size={30} className="text-indigo-600" />
        </div>

        {/* Heading */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold text-gray-900 transition-all duration-300">
            {heading}
          </h1>
          <p className="text-sm text-gray-500">
            Choose how you want to use the platform
          </p>
        </div>

        {/* Role Cards */}
        <div className="flex gap-4 justify-center flex-wrap">
          {roleCards.map((card) => {
            const isSelected = selected === card.role;
            return (
              <button
                key={card.role}
                onClick={() => setSelected(card.role)}
                className={`relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 shadow-sm w-48 transition-all duration-200 outline-none
                  ${
                    isSelected
                      ? "border-primary bg-white shadow-md"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                  }`}
              >
                {/* Check icon top right */}
                {isSelected && (
                  <span className="absolute top-3 right-3 text-primary">
                    <CheckCircle2 size={18} />
                  </span>
                )}

                {/* Role icon */}
                <div
                  className={`flex items-center justify-center w-14 h-14 rounded-full transition-colors duration-200
                    ${isSelected ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}
                >
                  {card.icon}
                </div>

                {/* Label */}
                <span
                  className={`text-sm font-semibold ${isSelected ? "text-primary" : "text-gray-700"}`}
                >
                  {card.label}
                </span>

                {/* Description */}
                <span className="text-xs text-gray-400 text-center leading-relaxed">
                  {card.description}
                </span>
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={!selected}
          className="flex items-center gap-2 px-6"
        >
          Continue
          <ArrowRight size={15} />
        </Button>

        {/* Login link */}
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-primary font-medium hover:underline"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};
