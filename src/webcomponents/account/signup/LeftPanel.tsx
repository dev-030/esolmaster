import { BookOpen, GraduationCap } from "lucide-react";

export const LeftPanel = ({ role }: { role: "student" | "teacher" | "admin" }) => {
  const isTeacher = role === "teacher";

  return (
    <div
      className="hidden md:flex w-1/2 h-full overflow-y-hidden bg-indigo-600 flex-col items-center justify-center px-12 gap-8"
      style={{
        overflow: "hidden",
      }}
    >
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-500 rounded-full opacity-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-indigo-700 rounded-full opacity-40 translate-y-1/2 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        {/* Icon */}
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm">
          {isTeacher ? (
            <BookOpen size={40} className="text-white" />
          ) : (
            <GraduationCap size={40} className="text-white" />
          )}
        </div>

        {/* Text */}
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-bold text-white leading-tight">
            {isTeacher ? "Empower Your Students" : "Unlock Your Potential"}
          </h2>
          <p className="text-indigo-200 text-sm leading-relaxed max-w-xs">
            {isTeacher
              ? "Create engaging lessons and track student progress with advanced tools."
              : "Engage in dynamic lessons, set goals, and track your own progress with powerful tools."}
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-col gap-2 w-full max-w-xs mt-4">
          {(isTeacher
            ? [
                "Create & manage tasks",
                "Track student analytics",
                "Schedule lessons easily",
              ]
            : [
                "Access curated lessons",
                "Track your progress",
                "Earn achievements",
              ]
          ).map((f) => (
            <div
              key={f}
              className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 shrink-0" />
              <span className="text-sm text-indigo-100">{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};