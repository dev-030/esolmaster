"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  CreditCard,
  Bell,
  ShieldCheck,
} from "lucide-react";

export const SettingsBar = () => {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Profile Information",
      href: "/profile_teacher/edit_profile",
      icon: User,
    },
    {
      label: "Notification",
      href: "/profile_teacher/notification",
      icon: Bell,
    },
    {
      label: "Security",
      href: "/profile_teacher/security",
      icon: ShieldCheck,
    },
    {
      label: "Billing Information",
      href: "/profile_teacher/billing_info",
      icon: CreditCard,
    },
  ];

  return (
    <div className="w-full md:max-w-[320px] bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <nav className="flex flex-col max-md:flex-row shrink-0 overflow-x-auto py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-6 py-4 transition-colors relative  ${
                isActive
                  ? "bg-primary/35 text-primary "
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {/* Left Active Indicator Bar */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1.25 bg-[#C5A073]" />
              )}

              <item.icon size={24} strokeWidth={1.5} />
              <span className="md:text-lg text-xs font-medium hidden md:inline">
                {item.label}
              </span>
            </Link>
          );
        })}        
      </nav>
    </div>
  );
};
