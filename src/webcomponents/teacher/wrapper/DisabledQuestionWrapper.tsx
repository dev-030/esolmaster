import { PercentageBar } from "./PercentageBar";

export const DisabledQuestionWrapper = ({
  children,
  percentage,
  onEdit,
}: {
  children: React.ReactNode;
  percentage?: number;
  onEdit?: () => void;
}) => {
  return (
    <div className="space-y-2">
      {children}
      {typeof percentage === "number" && (
        <div className="px-4 pb-3 -mt-1">
          <PercentageBar percentage={percentage} />
        </div>
      )}
    </div>
  );
};
