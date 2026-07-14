import { SectionHeading } from "@/webcomponents/reusable";
import { SettingsBar } from "@/webcomponents/teacher";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col py-16 px-4 sm:px-6 lg:px-8 w-full">
      <SectionHeading
        heading="Account Settings"
        subheading="Manage your account settings and preferences"
      />

      <div className="flex items-start max-md:flex-col py-16 gap-3.5 w-full">
        <SettingsBar />
        <div className="flex-1 max-md:w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
