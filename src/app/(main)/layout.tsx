import { RoleProvider } from "@/provider/RoleProvider";
import { TranstackProvider } from "@/provider/TranstackProvider";
import { Navbar, Sidebar } from "@/webcomponents/ui";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 font-inter">
      {/* Sidebar gets role from server, but uses localStorage internally for profile */}
      <TranstackProvider>
        <RoleProvider>
          <Sidebar />
        </RoleProvider>
      </TranstackProvider>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TranstackProvider>
          <RoleProvider>
            <Navbar />
          </RoleProvider>
        </TranstackProvider>

        <main className="flex-1 overflow-y-auto p-6">
          <TranstackProvider>
            <RoleProvider>{children}</RoleProvider>
          </TranstackProvider>
        </main>
      </div>
    </div>
  );
}
