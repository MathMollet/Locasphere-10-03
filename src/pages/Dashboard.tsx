import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, Wallet, TrendingUp, ClipboardList, 
  AlertTriangle, Calendar as CalendarIcon, ArrowUpRight,
  Shield, Home, Calculator
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProperties } from '../hooks/useProperties';
import { useTenants } from '../hooks/useTenants';
import { useApplications } from '../hooks/useApplications';
import { useIncidents } from '../hooks/useIncidents';
import { userService } from '../services/userService';
import DashboardCard from '../components/DashboardCard';
import RentChart from '../components/dashboard/RentChart';
import PropertyRentSummary from '../components/dashboard/PropertyRentSummary';
import OccupancyChart from '../components/dashboard/OccupancyChart';
import AlertsList from '../components/dashboard/AlertsList';
import UpcomingEvents from '../components/dashboard/UpcomingEvents';
import FinancialMetrics from '../components/dashboard/FinancialMetrics';

export default function Dashboard() {
  const { user } = useAuth();
  const { properties } = useProperties();
  const { tenants } = useTenants();
  const { applications } = useApplications();
  const { incidents } = useIncidents();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const allUsers = await userService.getUsers();
        setUsers(allUsers);
        setError(null);
      } catch (err) {
        console.error('Error loading users:', err);
        setError('Erreur lors du chargement des utilisateurs');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === 'admin') {
      loadUsers();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  // Afficher le tableau de bord administrateur
  if (user?.role === 'admin') {
    if (isLoading) {
      return <div className="p-8">Chargement...</div>;
    }

    if (error) {
      return <div className="p-8 text-red-600">{error}</div>;
    }

    const ownerCount = users.filter(u => u.role === 'owner').length;
    const tenantCount = users.filter(u => u.role === 'tenant').length;

    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tableau de bord administrateur
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Vue d'ensemble de l'activité de la plateforme
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <DashboardCard
            title="Utilisateurs"
            value={users.length.toString()}
            icon={Users}
            trend={{ value: users.length, isPositive: true }}
          />
          <DashboardCard
            title="Propriétaires"
            value={ownerCount.toString()}
            icon={Building2}
            trend={{ value: ownerCount, isPositive: true }}
          />
          <DashboardCard
            title="Locataires"
            value={tenantCount.toString()}
            icon={Users}
            trend={{ value: tenantCount, isPositive: true }}
          />
          <DashboardCard
            title="Biens"
            value={properties.length.toString()}
            icon={Building2}
            trend={{ value: properties.length, isPositive: true }}
          />
        </div>

        {/* Statistiques détaillées */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Répartition des utilisateurs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/50 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Répartition des utilisateurs
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Propriétaires</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{ownerCount}</span>
                  <span className="text-xs text-gray-500">({Math.round(ownerCount / users.length * 100)}%)</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: `${(ownerCount / users.length) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Locataires</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{tenantCount}</span>
                  <span className="text-xs text-gray-500">({Math.round(tenantCount / users.length * 100)}%)</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(tenantCount / users.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Statistiques des biens */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/50 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Statistiques des biens
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Biens disponibles</span>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {properties.filter(p => p.status === 'available').length}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Biens loués</span>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {properties.filter(p => p.status === 'rented').length}
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${(properties.filter(p => p.status === 'rented').length / properties.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Afficher le tableau de bord standard pour les autres utilisateurs
  const pendingApplications = applications.filter(app => app.status === 'pending');
  const activeIncidents = incidents.filter(inc => inc.status !== 'resolved');

  const rentData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
    expected: [4500, 4500, 4500, 4800, 4800, 4800],
    received: [4500, 4500, 4300, 4800, 4600, 4800],
  };

  const occupancyData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû'],
    current: [85, 85, 90, 90, 95, 95, 90, 90],
    projected: [90, 85, 85, 80, 85, 90, 95, 95],
  };

  const alerts = [
    { id: '1', type: 'payment', message: 'Retard de paiement - Appartement Centre Ville' },
    { id: '2', type: 'document', message: 'Documents manquants - Thomas Martin' },
    { id: '3', type: 'contract', message: 'Fin de bail dans 30 jours - Maison Bordeaux' },
  ];

  const events = [
    { id: '1', type: 'visit', title: 'Visite - Appartement Paris', date: '2024-03-20' },
    { id: '2', type: 'maintenance', title: 'Intervention plombier', date: '2024-03-22' },
    { id: '3', type: 'inventory', title: 'État des lieux sortant', date: '2024-03-25' },
  ];

  const financialMetrics = {
    totalRevenue: 4800,
    expenses: 800,
    netIncome: 4000,
    roi: 5.2,
  };

  const propertyRents = [
    { name: 'Appartement Centre Ville', expectedRent: 1200, receivedRent: 1200, difference: 0 },
    { name: 'Maison Bordeaux', expectedRent: 1500, receivedRent: 1400, difference: -100 },
    { name: 'Studio Paris', expectedRent: 800, receivedRent: 800, difference: 0 },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tableau de bord</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Vue d'ensemble de votre gestion locative
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <DashboardCard
          title="Biens immobiliers"
          value={properties.length.toString()}
          icon={Building2}
        />
        <DashboardCard
          title="Locataires actifs"
          value={tenants.filter(t => t.status === 'active').length.toString()}
          icon={Users}
          trend={{ value: 20, isPositive: true }}
        />
        <DashboardCard
          title="Candidatures à traiter"
          value={pendingApplications.length.toString()}
          icon={ClipboardList}
        />
        <DashboardCard
          title="Incidents en cours"
          value={activeIncidents.length.toString()}
          icon={AlertTriangle}
          trend={activeIncidents.length > 2 ? { value: activeIncidents.length, isPositive: false } : undefined}
        />
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Performance financière
        </h2>
        <FinancialMetrics metrics={financialMetrics} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/50 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Suivi des loyers
          </h2>
          <RentChart data={rentData} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/50 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Taux d'occupation
          </h2>
          <OccupancyChart data={occupancyData} />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Revenus par bien
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {propertyRents.map((property) => (
            <PropertyRentSummary
              key={property.name}
              name={property.name}
              expectedRent={property.expectedRent}
              receivedRent={property.receivedRent}
              difference={property.difference}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/50 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Alertes
          </h2>
          <AlertsList alerts={alerts} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/50 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-indigo-500" />
            Événements à venir
          </h2>
          <UpcomingEvents events={events} />
        </div>
      </div>
    </div>
  );
}