import React, { useState } from 'react';
import { X, Download, Calendar, Phone, Mail, Building2, User, FileDown, FileText, Upload } from 'lucide-react';
import { Tenant } from '../../types/tenant';
import { Property } from '../../types/property';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';

interface TenantDetailsModalProps {
  tenant: Tenant;
  property: { name: string } | undefined;
  isOpen: boolean;
  onClose: () => void;
}

const documentTypeLabels = {
  // Documents du locataire
  id_card: 'Carte d\'identité',
  work_contract: 'Contrat de travail',
  payslip_1: '1er bulletin de salaire',
  payslip_2: '2ème bulletin de salaire',
  payslip_3: '3ème bulletin de salaire',
  proof_of_address: 'Justificatif de domicile',
  rent_receipt_1: '1ère quittance de loyer',
  rent_receipt_2: '2ème quittance de loyer',
  rent_receipt_3: '3ème quittance de loyer',
  tax_notice_1: 'Dernier avis d\'imposition',
  tax_notice_2: 'Avant-dernier avis d\'imposition',
  // Documents du garant
  guarantor_id_card: 'Carte d\'identité',
  guarantor_work_contract: 'Attestation de CDI ou contrat de travail',
  guarantor_payslip_1: '1er bulletin de salaire',
  guarantor_payslip_2: '2ème bulletin de salaire',
  guarantor_payslip_3: '3ème bulletin de salaire',
  guarantor_proof_of_address: 'Justificatif de domicile',
  guarantor_property_tax: 'Taxe foncière',
  guarantor_rent_receipt_1: '1ère quittance de loyer',
  guarantor_rent_receipt_2: '2ème quittance de loyer',
  guarantor_rent_receipt_3: '3ème quittance de loyer',
  guarantor_tax_notice_1: 'Dernier avis d\'imposition',
  guarantor_tax_notice_2: 'Avant-dernier avis d\'imposition',
  guarantor_visale: 'Numéro Visale',
};

export default function TenantDetailsModal({
  tenant,
  property,
  isOpen,
  onClose,
}: TenantDetailsModalProps) {
  if (!isOpen) return null;

  const tenantDocuments = tenant.documents.filter(
    doc => !doc.type.startsWith('guarantor_')
  );

  const guarantorDocuments = tenant.documents.filter(
    doc => doc.type.startsWith('guarantor_')
  );

  const handleExportAllDocuments = () => {
    tenant.documents.forEach(doc => {
      window.open(doc.url, '_blank');
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl my-8">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {tenant.firstName} {tenant.lastName}
            </h2>
            {property && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {property.name}
              </p>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <X className="h-6 w-6" />
          </button>
        </div>

        <Tabs defaultValue="info" className="p-6">
          <TabsList>
            <TabsTrigger value="info">Informations locataire</TabsTrigger>
            <TabsTrigger value="documents">Dossier locataire</TabsTrigger>
            <TabsTrigger value="contract">Espace contractuel</TabsTrigger>
            <TabsTrigger value="admin">Gestion administrative</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-6">
            <div className="flex items-center gap-6">
              {/* Photo de profil */}
              <div>
                {tenant.avatarUrl ? (
                  <img
                    src={tenant.avatarUrl}
                    alt={`${tenant.firstName} ${tenant.lastName}`}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-2xl font-medium text-gray-600 dark:text-gray-300">
                      {tenant.firstName[0]}{tenant.lastName[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* Informations du locataire */}
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {tenant.firstName} {tenant.lastName}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-1 mt-2 rounded-full text-xs font-medium ${
                    tenant.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
                      : tenant.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-400'
                  }`}>
                    {tenant.status === 'active' ? 'Locataire actif' :
                     tenant.status === 'pending' ? 'En attente' :
                     'Ancien locataire'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="text-sm">{tenant.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Phone className="h-4 w-4 mr-2" />
                    <span className="text-sm">{tenant.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <div className="space-y-6">
              <div className="flex justify-end">
                <button
                  onClick={handleExportAllDocuments}
                  className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                >
                  <FileDown className="h-4 w-4" />
                  Exporter tous les documents
                </button>
              </div>

              {/* Documents du locataire */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Documents du locataire
                </h3>
                <div className="space-y-3">
                  {tenantDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {documentTypeLabels[doc.type]}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Ajouté le {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => window.open(doc.url, '_blank')}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-full"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents du garant */}
              {guarantorDocuments.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Documents du garant
                  </h3>
                  <div className="space-y-3">
                    {guarantorDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {documentTypeLabels[doc.type]}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Ajouté le {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => window.open(doc.url, '_blank')}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-full"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="contract" className="mt-6">
            <div className="space-y-4">
              {/* Contrat de location */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Contrat de location
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Signé le {new Date(tenant.rentStartDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-full">
                  <Download className="h-4 w-4" />
                </button>
              </div>

              {/* Attestation d'assurance */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Attestation d'assurance
                    </p>
                    <p className="text-xs text-red-500 dark:text-red-400">
                      Document manquant
                    </p>
                  </div>
                </div>
                <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                  <Upload className="h-4 w-4" />
                  <span>Ajouter</span>
                  <input type="file" className="hidden" accept=".pdf" />
                </label>
              </div>

              {/* Preuve de paiement caution */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Preuve de paiement caution
                    </p>
                    <p className="text-xs text-red-500 dark:text-red-400">
                      Document manquant
                    </p>
                  </div>
                </div>
                <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                  <Upload className="h-4 w-4" />
                  <span>Ajouter</span>
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                </label>
              </div>

              {/* Preuve de paiement premier loyer */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Preuve de paiement premier loyer
                    </p>
                    <p className="text-xs text-red-500 dark:text-red-400">
                      Document manquant
                    </p>
                  </div>
                </div>
                <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                  <Upload className="h-4 w-4" />
                  <span>Ajouter</span>
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                </label>
              </div>

              {/* État des lieux d'entrée */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      État des lieux d'entrée
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Réalisé le {new Date(tenant.rentStartDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-full">
                  <Download className="h-4 w-4" />
                </button>
              </div>

              {/* État des lieux de sortie */}
              {tenant.rentEndDate && (
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        État des lieux de sortie
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Réalisé le {new Date(tenant.rentEndDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-full">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="admin" className="mt-6">
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                La gestion administrative sera bientôt disponible
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}