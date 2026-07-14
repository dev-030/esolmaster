export const InfoRow=({
  label, value, className, mono,
}: {
  label: string;
  value: string;
  className?: string;
  mono?: boolean;
}) =>{
  return (
    <div className={className}>
      <p className="text-xs text-muted-foreground font-medium mb-0.5">{label}</p>
      <p className={mono ? "font-mono text-xs text-muted-foreground" : "text-foreground font-medium"}>
        {value}
      </p>
    </div>
  );
}