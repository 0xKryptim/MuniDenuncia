import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Layout } from '@/components/layout/Layout';
import { LoginPage } from '@/app/login';
import { DashboardPage } from '@/app/dashboard';
import { ReportPage } from '@/app/report';
import { RequestsPage } from '@/app/requests';
import { RequestDetailPage } from '@/app/requests/[id]';
import { AccountPage } from '@/app/account';
import { SettingsPage } from '@/app/settings';

const queryClient = new QueryClient();

export function App() {
  const { initialize } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Apply theme class to document on mount
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes with Layout */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<DashboardPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/requests" element={<RequestsPage />} />
            <Route path="/requests/:id" element={<RequestDetailPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}
