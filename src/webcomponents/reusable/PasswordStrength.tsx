"use client";

type Strength = "empty" | "weak" | "fair" | "good" | "strong";

const getStrength = (password: string): Strength => {
  if (!password) return "empty";
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return "weak";
  if (score === 2) return "fair";
  if (score === 3) return "good";
  return "strong";
};

const strengthConfig: Record<Strength, { label: string; color: string; width: string; segments: number }> = {
  empty:  { label: "",       color: "bg-gray-200",   width: "w-0",    segments: 0 },
  weak:   { label: "Weak",   color: "bg-red-500",    width: "w-1/4",  segments: 1 },
  fair:   { label: "Fair",   color: "bg-orange-400", width: "w-2/4",  segments: 2 },
  good:   { label: "Good",   color: "bg-yellow-400", width: "w-3/4",  segments: 3 },
  strong: { label: "Strong", color: "bg-green-500",  width: "w-full", segments: 4 },
};

interface PasswordStrengthBarProps {
  password: string;
}

export const PasswordStrengthBar = ({ password }: PasswordStrengthBarProps) => {
  const strength = getStrength(password);
  const config = strengthConfig[strength];

  if (strength === "empty") return null;

  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((seg) => (
          <div
            key={seg}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              seg <= config.segments ? config.color : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${
        strength === "weak"   ? "text-red-500"    :
        strength === "fair"   ? "text-orange-400" :
        strength === "good"   ? "text-yellow-500" :
        "text-green-500"
      }`}>
        {config.label}
      </p>
    </div>
  );
};