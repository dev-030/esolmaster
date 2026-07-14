export const SectionHeading = ({
  heading,
  subheading,
  className = "",
  action,
}: {
  heading: string;
  subheading?: string;
  className?: string;
  action?: React.ReactNode;
}) => (
  <div className={`flex items-start justify-between ${className}`}>
    <div>
      <h1 className="text-2xl font-bold text-foreground tracking-tight">{heading}</h1>
      {subheading && <p className="text-sm text-muted-foreground mt-1">{subheading}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);