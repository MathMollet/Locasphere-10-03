import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  AlertTriangle, 
  Home, 
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Calculator,
  Database,
  MessageSquare,
  FileText,
  HelpCircle,
  Search
} from 'lucide-react';
import { useSidebar } from '../contexts/SidebarContext';
import { useAuth } from '../contexts/AuthContext';
import SupportModal from './support/SupportModal';

export default function Sidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { user } = useAuth();
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // Navigation principale selon le rôle
  const mainNavigation = user?.role === 'admin' ? [
    { id: 'dashboard', name: 'Dashboard', href: '/dashboard', icon: Home, end: true, section: 'main' },
    { id: 'admin-db', name: 'Admin DB', href: '/dashboard/db-admin', icon: Database, section: 'main' },
    { id: 'separator-1', name: 'separator-1', separator: true, section: 'main' },
    { id: 'chat', name: 'Messagerie', href: '/dashboard/chat', icon: MessageSquare, section: 'main' }
  ] : user?.role === 'owner' ? [
    { id: 'dashboard', name: 'Dashboard', href: '/dashboard', icon: Home, end: true, section: 'main' },
    { id: 'properties', name: 'Mes biens', href: '/dashboard/properties', icon: Building2, section: 'main' },
    { id: 'applications', name: 'Candidatures', href: '/dashboard/applications', icon: ClipboardList, section: 'main' },
    { id: 'tenants', name: 'Mes locataires', href: '/dashboard/tenants', icon: Users, section: 'main' },
    { id: 'incidents', name: 'Incidents', href: '/dashboard/incidents', icon: AlertTriangle, section: 'main' },
    { id: 'accounting', name: 'Comptabilité', href: '/dashboard/accounting', icon: Calculator, section: 'main' },
    { id: 'separator-1', name: 'separator-1', separator: true, section: 'main' },
    { id: 'chat', name: 'Messagerie', href: '/dashboard/chat', icon: MessageSquare, section: 'main' }
  ] : [
    { id: 'dashboard', name: 'Dashboard', href: '/dashboard', icon: Home, end: true, section: 'main' },
    { id: 'tenant-file', name: 'Mon dossier', href: '/dashboard/tenant-file', icon: FileText, section: 'main' },
    { id: 'search', name: 'Recherche de biens', href: '/dashboard/search', icon: Search, section: 'main' },
    { id: 'tenant-applications', name: 'Mes candidatures', href: '/dashboard/tenant-applications', icon: ClipboardList, section: 'main' },
    { id: 'tenant-property', name: 'Mon logement', href: '/dashboard/tenant-property', icon: Home, section: 'main' },
    { id: 'tenant-incidents', name: 'Mes incidents', href: '/dashboard/tenant-incidents', icon: AlertTriangle, section: 'main' },
    { id: 'separator-1', name: 'separator-1', separator: true, section: 'main' },
    { id: 'chat', name: 'Messagerie', href: '/dashboard/chat', icon: MessageSquare, section: 'main' }
  ];

  // Navigation commune (en bas)
  const commonNavigation = [
    { id: 'faq', name: 'FAQ', href: '/dashboard/faq', icon: BookOpen, section: 'common' },
    { id: 'resources', name: 'Ressources', href: '/dashboard/resources', icon: FileText, section: 'common' },
    { 
      id: 'support',
      name: 'Support', 
      href: '#',
      icon: HelpCircle, 
      section: 'common',
      onClick: () => setIsSupportModalOpen(true)
    }
  ];

  // Combiner la navigation
  const navigation = [...mainNavigation, ...commonNavigation];

  return (
    <>
    <div className={`flex h-full flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 relative transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        )}
      </button>

      <nav className="flex flex-1 flex-col justify-between">
        {/* Navigation principale */}
        <ul role="list" className="flex flex-col gap-1 px-3 py-4">
          {navigation.map((item) => (
            item.section === 'main' && (
              <React.Fragment key={item.id}>
                {item.separator ? (
                  <li className="my-2 border-t border-gray-200 dark:border-gray-700" />
                ) : (
                  <li>
                    <NavLink
                      to={item.href}
                      end={item.end}
                      className={({ isActive }) =>
                        `group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 ${
                          isActive
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-400'
                        } ${isCollapsed ? 'justify-center' : ''}`
                      }
                      title={isCollapsed ? item.name : undefined}
                    >
                      <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                      {!isCollapsed && <span>{item.name}</span>}
                    </NavLink>
                  </li>
                )}
              </React.Fragment>
            )
          ))}
        </ul>
        
        {/* Navigation commune (en bas) */}
        <ul role="list" className="flex flex-col gap-1 px-3 py-4 border-t border-gray-200 dark:border-gray-700">
          {navigation.map((item) => (
            item.section === 'common' && (
              <li key={item.id}>
                {item.onClick ? (
                  <button
                    onClick={item.onClick}
                    className={`w-full group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 ${
                      isCollapsed ? 'justify-center' : ''
                    }`}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </button>
                ) : (
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-400'
                      } ${isCollapsed ? 'justify-center' : ''}`
                    }
                    title={isCollapsed ? item.name : undefined}
                  >
                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </NavLink>
                )}
              </li>
            )
          ))}
        </ul>
      </nav>
    </div>
    <SupportModal
      isOpen={isSupportModalOpen}
      onClose={() => setIsSupportModalOpen(false)}
    />
    </>
  );
}