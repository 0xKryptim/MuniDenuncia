import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      {/* Topbar */}
      <Topbar />

      {/* Main Content Area */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <Sidebar />

        {/* Page Content */}
        <main className="flex-1 lg:ml-64 w-full overflow-auto">
          <div className="h-full px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
