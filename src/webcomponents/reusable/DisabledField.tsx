import { cn } from "@/lib/utils";

export const DisabledField = ({
  value,
  placeholder = "—",
  multiline = false,
}: {
  value: string;
  placeholder?: string;
  multiline?: boolean;
}) => {
  const isEmpty = !value.trim();
  const base = cn(
    "w-full rounded-md bg-muted/60 border border-border px-3 py-2 text-sm",
    isEmpty && "text-muted-foreground/50 italic",
    multiline && "min-h-[80px] whitespace-pre-wrap",
  );
  return <div className={base}>{isEmpty ? placeholder : value}</div>;
};
