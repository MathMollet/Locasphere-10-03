import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import UserMenu from '../components/UserMenu';
import ThemeToggle from '../components/ThemeToggle';
import NotificationBell from '../components/notifications/NotificationBell';
import SupportModal from '../components/support/SupportModal';
import { SidebarProvider } from '../contexts/SidebarContext';
import { NotificationProvider } from '../contexts/NotificationContext';

export default function MainLayout() {
  const { user } = useAuth();
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const location = useLocation();

  return (
    <NotificationProvider>
      <SidebarProvider>
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          <div className="hidden md:block">
            <Sidebar />
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    IZIMO
                  </h1>
                  <div className="flex items-center gap-4">
                    <NotificationBell />
                  <ThemeToggle />
                  <UserMenu />
                  </div>
                </div>
              </div>
            </header>
            <main className="flex-1 overflow-auto">
              <Outlet />
            </main>
          </div>
        </div>

        <SupportModal
          isOpen={isSupportModalOpen}
          onClose={() => setIsSupportModalOpen(false)}
        />
      </SidebarProvider>
    </NotificationProvider>
  );
}