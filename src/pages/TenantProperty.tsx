import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProperties } from '../hooks/useProperties';
import { tenantService } from '../services/tenantService';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import PropertyInfo from '../components/tenant-property/PropertyInfo';
import LeaseDocument from '../components/tenant-property/LeaseDocument';
import TechnicalDocument from '../components/tenant-property/TechnicalDocument';
import AdministrativeSpace from '../components/tenant-property/AdministrativeSpace';
import { MessageSquare, FileText, LogOut, AlertTriangle, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TenantProperty() {
  const { user } = useAuth();
  const { properties } = useProperties();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Charger les locataires au montage du composant
    const loadedTenants = tenantService.getTenants();
    setTenants(loadedTenants);
    setIsLoading(false);
  }, []);

  // Trouver le locataire actuel et son bien
  const currentTenant = tenants.find(t => t.id === user?.email);
  const property = currentTenant ? properties.find(p => p.id === currentTenant.propertyId) : null;

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!property || !currentTenant) {
    return (
      <div className="p-8">
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Aucun bien associé à votre compte
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Contactez votre propriétaire pour plus d'informations
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mon logement
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Toutes les informations concernant votre logement
          </p>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors"
          >
            Gérer mon bien
            <ChevronDown className={`h-4 w-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
              <div className="py-1">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate(`/chat?tenant=${currentTenant?.id}`);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <MessageSquare className="h-5 w-5 text-indigo-500" />
                  <div className="text-left">
                    <p className="font-medium">Contacter mon propriétaire</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Envoyer un message à votre propriétaire</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <FileText className="h-5 w-5 text-indigo-500" />
                  <div className="text-left">
                    <p className="font-medium">Mettre à jour mon attestation</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Ajouter une nouvelle attestation d'assurance</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/dashboard/tenant-incidents');
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <AlertTriangle className="h-5 w-5 text-indigo-500" />
                  <div className="text-left">
                    <p className="font-medium">Déclarer un incident</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Signaler un problème dans votre logement</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <LogOut className="h-5 w-5 text-indigo-500" />
                  <div className="text-left">
                    <p className="font-medium">Prévenir de mon départ</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Informer mon propriétaire de mon départ</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="info" className="mt-8">
        <TabsList>
          <TabsTrigger value="info">Informations sur mon logement</TabsTrigger>
          <TabsTrigger value="contract">Mes documents contractuels</TabsTrigger>
          <TabsTrigger value="admin">Mes documents administratifs</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-6">
          <div className="space-y-8">
            <PropertyInfo property={property} />
            <TechnicalDocument property={property} />
          </div>
        </TabsContent>

        <TabsContent value="contract" className="mt-6">
          <LeaseDocument tenant={currentTenant} property={property} />
        </TabsContent>

        <TabsContent value="admin" className="mt-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/50 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Mes documents administratifs
            </h3>
            <AdministrativeSpace tenant={currentTenant} property={property} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}