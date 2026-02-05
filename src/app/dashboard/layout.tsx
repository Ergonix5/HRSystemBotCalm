import { ReactNode } from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import { NotificationProvider } from "../../contexts/NotificationContext";


export default function DashboardLayout({ children }: { children: ReactNode })
{
  return (
    <NotificationProvider>
      <div className="flex h-screen ">

        {/* h-screen bg-muted/30 */}
        <Sidebar />
        <div className="flex flex-col flex-1 transition-all duration-300" style={{ marginLeft: 'var(--sidebar-width, 16rem)' }}>
          <Header />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </NotificationProvider>
  );
}