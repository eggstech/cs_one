import { AppSidebar } from "@/components/layout/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen p-4 gap-4">
      <AppSidebar />
      <main className="flex-1 flex flex-col bg-card rounded-lg shadow-sm">
        {children}
      </main>
    </div>
  );
}
