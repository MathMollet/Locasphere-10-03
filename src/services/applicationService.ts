import { v4 as uuidv4 } from 'uuid';
import { storage } from '../utils/storage';
import { Application } from '../types/application';
import { notificationService } from './notificationService';
import { tenantService } from './tenantService';
import { Property } from '../types/property';
import { User } from '../types/user';
import { tenantFileService } from './tenantFileService';

const APPLICATIONS_STORAGE_KEY = 'izimo_applications';

export const applicationService = {
  getApplications(): Application[] {
    const applications = storage.get(APPLICATIONS_STORAGE_KEY);
    return Array.isArray(applications) ? applications : [];
  },

  saveApplications(applications: Application[]): void {
    storage.set(APPLICATIONS_STORAGE_KEY, applications);
  },

  createApplication(propertyId: string, tenant: User, property: Property): Application {
    const applications = this.getApplications();
    
    // Vérifier si une candidature existe déjà pour ce bien et ce locataire
    const existingApplication = applications.find(
      app => app.propertyId === propertyId && 
             app.applicant.email === tenant.email &&
             app.status !== 'cancelled'
    );

    if (existingApplication) {
      throw new Error('Vous avez déjà une candidature en cours pour ce bien');
    }

    // Récupérer le dossier locataire
    const tenantFile = tenantFileService.getTenantFile(tenant.id);
    
    // Mapper les types de documents du dossier locataire vers les types de documents de candidature
    const documentTypeMapping = {
      'id_card': 'id_card',
      'work_contract': 'employment_contract',
      'payslip_1': 'payslip',
      'payslip_2': 'payslip',
      'payslip_3': 'payslip',
      'proof_of_address': 'proof_of_address',
      'tax_notice_1': 'tax_notice',
      'tax_notice_2': 'tax_notice'
    };

    // Filtrer et transformer les documents
    const documents = tenantFile?.documents
      .filter(doc => doc.type in documentTypeMapping)
      .map(doc => ({
        id: doc.id,
        type: documentTypeMapping[doc.type] as Application['documents'][0]['type'],
        name: doc.name,
        url: doc.url,
        uploadedAt: doc.uploadedAt
      })) || [];

    const newApplication: Application = {
      id: uuidv4(),
      propertyId,
      ownerId: property.ownerId,
      desiredStartDate: tenantFile?.personalInfo.desiredStartDate,
      status: 'pending',
      createdAt: new Date().toISOString(),
      applicant: {
        firstName: tenant.firstName,
        lastName: tenant.lastName,
        birthDate: tenantFile?.personalInfo.birthDate,
        age: tenantFile?.personalInfo.age,
        presentation: tenantFile?.personalInfo.presentation,
        email: tenant.email,
        phone: tenantFile?.personalInfo.phone || '',
        currentSituation: tenantFile?.personalInfo.status as any || 'employed',
        monthlyIncome: Number(tenantFile?.personalInfo.income) || 0,
        avatarUrl: tenant.avatarUrl
      },
      hasGuarantor: tenantFile?.personalInfo.hasGuarantor || false,
      documents: documents
    };

    applications.push(newApplication);
    this.saveApplications(applications);

    // Envoyer une notification au propriétaire
    notificationService.createNotification({
      userId: property.ownerId,
      type: 'info',
      title: 'Nouvelle candidature',
      message: `${tenant.firstName} ${tenant.lastName} a envoyé un dossier pour ${property.name}`,
      link: '/dashboard/applications'
    });

    return newApplication;
  },

  getApplicationsByOwner(ownerId: string): Application[] {
    const applications = this.getApplications();
    return applications.filter(app => app.ownerId === ownerId);
  },

  getApplicationsByApplicant(email: string): Application[] {
    const applications = this.getApplications();
    return applications.filter(app => 
      app.applicant.email.toLowerCase() === email.toLowerCase()
    );
  },

  updateApplicationStatus(applicationId: string, status: Application['status']): void {
    const applications = this.getApplications();
    const applicationIndex = applications.findIndex(app => app.id === applicationId);
    
    if (applicationIndex !== -1) {
      const application = applications[applicationIndex];
      
      // Si la candidature est acceptée, créer un nouveau locataire
      if (status === 'accepted') {
        const newTenant = tenantService.createTenantFromApplication(application);
        console.log('Nouveau locataire créé:', newTenant);
      }
      
      
      // Si la candidature est acceptée, créer un nouveau locataire
      if (status === 'accepted') {
        tenantService.createTenantFromApplication(application);
      }
      
      applications[applicationIndex].status = status;
      this.saveApplications(applications);

      // Envoyer une notification au locataire
      notificationService.createNotification({
        userId: application.applicant.email,
        type: status === 'accepted' ? 'success' : 'warning',
        title: status === 'accepted' ? 'Candidature acceptée' : 'Candidature refusée',
        message: status === 'accepted' 
          ? 'Votre candidature a été acceptée ! Le propriétaire vous contactera prochainement.'
          : 'Votre candidature n\'a malheureusement pas été retenue.',
        link: '/dashboard/tenant-applications'
      });
    }
  },

  cancelApplication(applicationId: string): void {
    const applications = this.getApplications();
    const applicationIndex = applications.findIndex(app => app.id === applicationId);
    
    if (applicationIndex !== -1) {
      const application = applications[applicationIndex];
      applications[applicationIndex].status = 'cancelled';
      this.saveApplications(applications);

      // Envoyer une notification au propriétaire
      notificationService.createNotification({
        userId: application.ownerId,
        type: 'warning',
        title: 'Candidature annulée',
        message: `${application.applicant.firstName} ${application.applicant.lastName} a annulé sa candidature`,
        link: '/dashboard/applications'
      });
    }
  },

  deleteApplication(applicationId: string): void {
    const applications = this.getApplications().filter(app => app.id !== applicationId);
    this.saveApplications(applications);
  },

  clearAllApplications(): void {
    storage.set(APPLICATIONS_STORAGE_KEY, []);
  }
};