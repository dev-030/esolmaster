export const ProgressCard = ({ title, gradient, value, label }: {
  title: string; gradient: string; value: number; label?: string;
}) => (
  <div className={`relative overflow-hidden rounded-2xl p-5 flex flex-col gap-4 shadow-sm ${gradient}`}>
    <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full opacity-10 bg-white" />
    <p className="text-sm font-semibold text-white/90 relative z-10">{title}</p>
    <div className="relative z-10">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-white/70">{label ?? "Progress"}</span>
        <span className="text-xs font-bold text-white">{value}%</span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-2">
        <div className="h-2 rounded-full bg-white transition-all duration-700" style={{ width: `${value}%` }} />
      </div>
    </div>
    <p className="text-4xl font-extrabold text-white relative z-10">{value}%</p>
  </div>
);
