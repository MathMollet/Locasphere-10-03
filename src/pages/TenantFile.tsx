import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, FileText, Upload, Download, Calendar } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import ConfirmationModal from '../components/common/ConfirmationModal';
import InputField from '../components/forms/InputField';
import CompletionPercentage from '../components/tenant-file/CompletionPercentage';
import { tenantFileService } from '../services/tenantFileService';
import SuccessBanner from '../components/common/SuccessBanner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  otherStatus?: string;
  income: string;
  presentation: string;
  hasGuarantor: boolean;
  desiredStartDate: string;
}

const getRequiredDocuments = (status: string) => {
  // Si aucun statut n'est sélectionné, retourner un objet vide
  if (!status) {
    return {};
  }

  const commonDocuments = {
    id_card: 'Document d\'identité',
    rent_receipt_1: 'Quittance de loyer M-1',
    rent_receipt_2: 'Quittance de loyer M-2',
    rent_receipt_3: 'Quittance de loyer M-3',
    rent_payment_proof: 'Attestation de paiement de loyer',
    other_income: 'Autre revenu',
  };

  switch (status) {
    case 'employed':
      return {
        id_card: 'Document d\'identité',
        work_contract: 'Contrat de travail',
        payslip_1: 'Bulletin de salaire M-1',
        payslip_2: 'Bulletin de salaire M-2',
        payslip_3: 'Bulletin de salaire M-3',
        tax_notice_1: 'Dernier avis d\'imposition',
        tax_notice_2: 'Avant-dernier avis d\'imposition',
        rent_receipt_1: 'Quittance de loyer M-1',
        rent_receipt_2: 'Quittance de loyer M-2',
        rent_receipt_3: 'Quittance de loyer M-3',
        rent_payment_proof: 'Attestation de paiement de loyer',
        other_income: 'Autre revenu'
      };
    case 'retired':
      return {
        id_card: 'Document d\'identité',
        pension_slip_1: 'Bulletin de pension M-1',
        pension_slip_2: 'Bulletin de pension M-2',
        pension_slip_3: 'Bulletin de pension M-3',
        tax_notice_1: 'Dernier avis d\'imposition',
        tax_notice_2: 'Avant-dernier avis d\'imposition',
        rent_receipt_1: 'Quittance de loyer M-1',
        rent_receipt_2: 'Quittance de loyer M-2',
        rent_receipt_3: 'Quittance de loyer M-3',
        rent_payment_proof: 'Attestation de paiement de loyer',
        other_income: 'Autre revenu'
      };
    case 'student':
      return {
        id_card: 'Document d\'identité',
        student_card: 'Carte d\'étudiant ou justificatif d\'inscription',
        rent_receipt_1: 'Quittance de loyer M-1',
        rent_receipt_2: 'Quittance de loyer M-2',
        rent_receipt_3: 'Quittance de loyer M-3',
        rent_payment_proof: 'Attestation de paiement de loyer',
        scholarship_proof: 'Attestation d\'aide (bourse, CAF)',
        other_income: 'Autre revenu'
      };
    case 'unemployed':
      return {
        id_card: 'Document d\'identité',
        unemployment_proof: 'Attestation France Travail (chômage)',
        rent_receipt_1: 'Quittance de loyer M-1',
        rent_receipt_2: 'Quittance de loyer M-2',
        rent_receipt_3: 'Quittance de loyer M-3',
        rent_payment_proof: 'Attestation de paiement de loyer',
        benefits_proof: 'Attestation d\'aide (CAF)',
        other_income: 'Autre revenu'
      };
    case 'business_owner':
      return {
        id_card: 'Document d\'identité',
        rent_receipt_1: 'Quittance de loyer M-1',
        rent_receipt_2: 'Quittance de loyer M-2',
        rent_receipt_3: 'Quittance de loyer M-3',
        rent_payment_proof: 'Attestation de paiement de loyer',
        kbis: 'Extrait K-bis de la société de moins de 3 mois',
        business_owner_payslip_1: '3 derniers bulletins de salaire (pour les dirigeants salariés)',
        accountant_attestation: 'Attestation de revenus d\'un expert-comptable pour l\'année en cours (pour les dirigeants non-salariés)',
        other_income: 'Autre revenu'
      };
    case 'other':
      return {
        id_card: 'Document d\'identité',
        work_contract: 'Contrat de travail',
        payslip_1: 'Bulletin de salaire M-1',
        payslip_2: 'Bulletin de salaire M-2',
        payslip_3: 'Bulletin de salaire M-3',
        tax_notice_1: 'Dernier avis d\'imposition',
        tax_notice_2: 'Avant-dernier avis d\'imposition',
        rent_receipt_1: 'Quittance de loyer M-1',
        rent_receipt_2: 'Quittance de loyer M-2',
        rent_receipt_3: 'Quittance de loyer M-3',
        rent_payment_proof: 'Attestation de paiement de loyer',
        other_income: 'Autre revenu',
        other: 'Autre'
      };
    default:
      return {};
  }
};

const getGuarantorDocuments = () => ({
  guarantor_id_card: 'Document d\'identité',
  guarantor_work_contract: 'Contrat de travail',
  guarantor_payslip_1: 'Bulletin de salaire M-1',
  guarantor_payslip_2: 'Bulletin de salaire M-2',
  guarantor_payslip_3: 'Bulletin de salaire M-3',
  guarantor_tax_notice_1: 'Dernier avis d\'imposition',
  guarantor_tax_notice_2: 'Avant-dernier avis d\'imposition',
  guarantor_rent_receipt_1: 'Quittance de loyer M-1',
  guarantor_rent_receipt_2: 'Quittance de loyer M-2',
  guarantor_rent_receipt_3: 'Quittance de loyer M-3',
  guarantor_rent_payment_proof: 'Attestation de paiement de loyer',
  guarantor_other_income: 'Autre revenu'
});

export default function TenantFile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    age: '0',
    status: '',
    otherStatus: '',
    income: '',
    presentation: '',
    hasGuarantor: false,
    income: '',
    desiredStartDate: '',
  });

  const [documents, setDocuments] = useState<{
    id: string;
    type: string;
    name: string;
    url: string;
    uploadedAt: string;
  }[]>([]);

  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [hasSecondaryProfile, setHasSecondaryProfile] = useState(false);
  const [secondaryFormData, setSecondaryFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '0',
    status: '',
    otherStatus: '',
    income: '',
    presentation: '',
    hasGuarantor: false,
  });
  const [secondaryDocuments, setSecondaryDocuments] = useState<{
    id: string;
    type: string;
    name: string;
    url: string;
    uploadedAt: string;
  }[]>([]);

  // Charger les données existantes au montage du composant
  useEffect(() => {
    if (user) {
      const savedFile = tenantFileService.getTenantFile(user.id);
      if (savedFile) {
        setFormData({
          ...savedFile.personalInfo,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });
        setDocuments(savedFile.documents);
      }
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    tenantFileService.saveTenantFile({
      userId: user.id,
      personalInfo: {
        ...formData,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      documents
    });

    setShowSuccessBanner(true);
  };

  const handleFileUpload = (type: keyof typeof documentTypes) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        // Simuler un upload de fichier
        const documentUrl = URL.createObjectURL(file);
        
        tenantFileService.addDocument(user.id, {
          type,
          name: file.name,
          url: documentUrl
        });

        // Mettre à jour l'état local
        const savedFile = tenantFileService.getTenantFile(user.id);
        if (savedFile) {
          setDocuments(savedFile.documents);
        }
      } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
      }
    }
  };

  const removeDocument = (id: string) => {
    if (!user) return;
    
    tenantFileService.removeDocument(user.id, id);
    
    // Mettre à jour l'état local
    const savedFile = tenantFileService.getTenantFile(user.id);
    if (savedFile) {
      setDocuments(savedFile.documents);
    }
  };

  const handleDownloadDocument = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <PageHeader
          title="Mon dossier de location"
          description="Gérez votre dossier de location pour faciliter vos candidatures"
        />
        <div className="flex items-center gap-4">
          <CompletionPercentage
            personalInfo={formData}
            documents={documents}
          />
          <button
            onClick={() => setIsConfirmationOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
          >
            Ajouter un profil secondaire
          </button>
        </div>
      </div>

      {showSuccessBanner && (
        <SuccessBanner
          message="Votre dossier a été enregistré avec succès"
          onClose={() => setShowSuccessBanner(false)}
        />
      )}

      <Tabs defaultValue="main" className="mt-8">
        <TabsList>
          <TabsTrigger value="main">Profil principal</TabsTrigger>
          {hasSecondaryProfile && (
            <TabsTrigger value="secondary">Profil secondaire</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="main" className="mt-6">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Informations personnelles */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/50 p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/50 rounded-full">
                    <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Informations personnelles
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Ces informations seront partagées avec les propriétaires
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <InputField
                    label="Nom"
                    value={formData.lastName}
                    onChange={(value) => setFormData(prev => ({ ...prev, lastName: value }))}
                    disabled
                  />
                  <InputField
                    label="Prénom"
                    value={formData.firstName}
                    onChange={(value) => setFormData(prev => ({ ...prev, firstName: value }))}
                    disabled
                  />
                </div>

                <div className="mt-6">
                  <InputField
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                    disabled
                  />
                </div>

                <div className="mt-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <InputField
                      label="Téléphone"
                      type="tel"
                      value={formData.phone}
                      onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
                      placeholder="06 12 34 56 78"
                    />
                    <InputField
                      label="Âge"
                      type="number"
                      value={formData.age || '0'}
                      onChange={(value) => setFormData(prev => ({ ...prev, age: value }))}
                      placeholder="25"
                      min="18"
                      max="120"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Statut
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Sélectionnez votre statut</option>
                    <option value="employed">Salarié</option>
                    <option value="student">Étudiant</option>
                    <option value="retired">Retraité</option>
                    <option value="unemployed">Sans emploi</option>
                    <option value="business_owner">Dirigeant d'entreprise</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                {formData.status === 'other' && (
                  <div className="mt-6">
                    <InputField
                      label="Précisez votre statut"
                      value={formData.otherStatus}
                      onChange={(value) => setFormData(prev => ({ ...prev, otherStatus: value }))}
                    />
                  </div>
                )}

                <div className="mt-6">
                  <InputField
                    label="Revenu mensuel (€)"
                    type="number"
                    value={formData.income}
                    onChange={(value) => setFormData(prev => ({ ...prev, income: value }))}
                    placeholder="2000"
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ma présentation
                    <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                      Profitez en pour vous présenter à votre futur bailleur
                    </p>
                  </label>
                  <div className="mt-1">
                    <textarea
                      value={formData.presentation}
                      onChange={(e) => setFormData(prev => ({ ...prev, presentation: e.target.value }))}
                      rows={4}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Garant
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.hasGuarantor}
                        onChange={() => setFormData(prev => ({ ...prev, hasGuarantor: true }))}
                        className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Oui</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={!formData.hasGuarantor}
                        onChange={() => setFormData(prev => ({ ...prev, hasGuarantor: false }))}
                        className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Non</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Informations location */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/50 p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/50 rounded-full">
                    <Calendar className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Informations location
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Précisez vos préférences de location
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <InputField
                    label="Date de début de bail souhaitée"
                    type="date"
                    value={formData.desiredStartDate}
                    onChange={(value) => setFormData(prev => ({ ...prev, desiredStartDate: value }))}
                  />
                </div>
              </div>

              {/* Documents */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/50 p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/50 rounded-full">
                    <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Documents
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Ajoutez les documents nécessaires à votre dossier
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {Object.entries(getRequiredDocuments(formData.status)).map(([type, label]) => {
                    const existingDoc = documents.find(doc => doc.type === type);
                    return (
                      <div key={type} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {label}
                            </p>
                            {existingDoc && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {existingDoc.name}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {existingDoc ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleDownloadDocument(existingDoc.url, existingDoc.name)}
                                className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-full"
                                title="Télécharger"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeDocument(existingDoc.id)}
                                className="text-sm text-red-600 dark:text-red-400 hover:text-red-500"
                              >
                                Supprimer
                              </button>
                            </>
                          ) : (
                            <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                              <Upload className="h-4 w-4" />
                              <span>Ajouter</span>
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileUpload(type)}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Documents du garant */}
              {formData.hasGuarantor && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/50 p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/50 rounded-full">
                      <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Documents garant
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Ajoutez les documents concernant votre garant
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(getGuarantorDocuments()).map(([type, label]) => {
                      const existingDoc = documents.find(doc => doc.type === type);
                      return (
                        <div key={type} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {label}
                              </p>
                              {existingDoc && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {existingDoc.name}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {existingDoc ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleDownloadDocument(existingDoc.url, existingDoc.name)}
                                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-full"
                                  title="Télécharger"
                                >
                                  <Download className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeDocument(existingDoc.id)}
                                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-500"
                                >
                                  Supprimer
                                </button>
                              </>
                            ) : (
                              <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                                <Upload className="h-4 w-4" />
                                <span>Ajouter</span>
                                <input
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={handleFileUpload(type)}
                                  className="hidden"
                                />
                              </label>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 flex items-center gap-2"
                >
                  <FileText className="h-5 w-5" />
                  Enregistrer mon dossier
                </button>
              </div>
            </form>
          </div>
        </TabsContent>

        {hasSecondaryProfile && (
          <TabsContent value="secondary" className="mt-6">
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Informations personnelles */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/50 p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/50 rounded-full">
                      <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Informations personnelles
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Informations du locataire secondaire
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <InputField
                      label="Nom"
                      value={secondaryFormData.lastName}
                      onChange={(value) => setSecondaryFormData(prev => ({ ...prev, lastName: value }))}
                      required
                    />
                    <InputField
                      label="Prénom"
                      value={secondaryFormData.firstName}
                      onChange={(value) => setSecondaryFormData(prev => ({ ...prev, firstName: value }))}
                      required
                    />
                  </div>

                  <div className="mt-6">
                    <InputField
                      label="Email"
                      type="email"
                      value={secondaryFormData.email}
                      onChange={(value) => setSecondaryFormData(prev => ({ ...prev, email: value }))}
                      required
                    />
                  </div>

                  <div className="mt-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <InputField
                        label="Téléphone"
                        type="tel"
                        value={secondaryFormData.phone}
                        onChange={(value) => setSecondaryFormData(prev => ({ ...prev, phone: value }))}
                        placeholder="06 12 34 56 78"
                        required
                      />
                      <InputField
                        label="Âge"
                        type="number"
                        value={secondaryFormData.age}
                        onChange={(value) => setSecondaryFormData(prev => ({ ...prev, age: value }))}
                        placeholder="25"
                        min="18"
                        max="120"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Statut
                    </label>
                    <select
                      value={secondaryFormData.status}
                      onChange={(e) => setSecondaryFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="">Sélectionnez votre statut</option>
                      <option value="employed">Salarié</option>
                      <option value="student">Étudiant</option>
                      <option value="retired">Retraité</option>
                      <option value="unemployed">Sans emploi</option>
                      <option value="business_owner">Dirigeant d'entreprise</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>

                  {secondaryFormData.status === 'other' && (
                    <div className="mt-6">
                      <InputField
                        label="Précisez votre statut"
                        value={secondaryFormData.otherStatus}
                        onChange={(value) => setSecondaryFormData(prev => ({ ...prev, otherStatus: value }))}
                        required
                      />
                    </div>
                  )}

                  <div className="mt-6">
                    <InputField
                      label="Revenu mensuel (€)"
                      type="number"
                      value={secondaryFormData.income}
                      onChange={(value) => setSecondaryFormData(prev => ({ ...prev, income: value }))}
                      placeholder="2000"
                      required
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ma présentation
                      <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                        Profitez en pour vous présenter au futur bailleur
                      </p>
                    </label>
                    <div className="mt-1">
                      <textarea
                        value={secondaryFormData.presentation}
                        onChange={(e) => setSecondaryFormData(prev => ({ ...prev, presentation: e.target.value }))}
                        rows={4}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Garant
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={secondaryFormData.hasGuarantor}
                          onChange={() => setSecondaryFormData(prev => ({ ...prev, hasGuarantor: true }))}
                          className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Oui</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={!secondaryFormData.hasGuarantor}
                          onChange={() => setSecondaryFormData(prev => ({ ...prev, hasGuarantor: false }))}
                          className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Non</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/50 p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/50 rounded-full">
                      <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Documents
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Documents du locataire secondaire
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(getRequiredDocuments(secondaryFormData.status)).map(([type, label]) => {
                      const existingDoc = secondaryDocuments.find(doc => doc.type === type);
                      return (
                        <div key={type} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {label}
                              </p>
                              {existingDoc && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {existingDoc.name}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {existingDoc ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleDownloadDocument(existingDoc.url, existingDoc.name)}
                                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-full"
                                  title="Télécharger"
                                >
                                  <Download className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeDocument(existingDoc.id)}
                                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-500"
                                >
                                  Supprimer
                                </button>
                              </>
                            ) : (
                              <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                                <Upload className="h-4 w-4" />
                                <span>Ajouter</span>
                                <input
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={handleFileUpload(type)}
                                  className="hidden"
                                />
                              </label>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Documents du garant */}
                {secondaryFormData.hasGuarantor && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/50 p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-indigo-50 dark:bg-indigo-900/50 rounded-full">
                        <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Documents garant
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Documents du garant du locataire secondaire
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {Object.entries(getGuarantorDocuments()).map(([type, label]) => {
                        const existingDoc = secondaryDocuments.find(doc => doc.type === type);
                        return (
                          <div key={type} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="flex items-center gap-4">
                              <FileText className="h-5 w-5 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {label}
                                </p>
                                {existingDoc && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {existingDoc.name}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {existingDoc ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleDownloadDocument(existingDoc.url, existingDoc.name)}
                                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-full"
                                    title="Télécharger"
                                  >
                                    <Download className="h-4 w-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeDocument(existingDoc.id)}
                                    className="text-sm text-red-600 dark:text-red-400 hover:text-red-500"
                                  >
                                    Supprimer
                                  </button>
                                </>
                              ) : (
                                <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                                  <Upload className="h-4 w-4" />
                                  <span>Ajouter</span>
                                  <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleFileUpload(type)}
                                    className="hidden"
                                  />
                                </label>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 flex items-center gap-2"
                  >
                    <FileText className="h-5 w-5" />
                    Enregistrer le profil secondaire
                  </button>
                </div>
              </form>
            </div>
          </TabsContent>
        )}
      </Tabs>

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={() => {
          setHasSecondaryProfile(true);
          setIsConfirmationOpen(false);
        }}
        title="Ajouter un locataire secondaire"
        message="Voulez-vous créer un locataire secondaire ? Ce locataire sera présent sur le futur bail de location. Il s'agit en général d'un conjoint ou d'une personne proche avec qui nous souhaitons louer un bien en commun."
      />
    </div>
  );
}