import db from '../../lib/db';
import { Application } from '../../types/application';

export const applicationService = {
  createApplication(application: Omit<Application, 'id' | 'createdAt'>): Application {
    const stmt = db.prepare(`
      INSERT INTO applications (
        id, status, message, propertyId, applicantId
      )
      VALUES (?, ?, ?, ?, ?)
    `);

    const id = crypto.randomUUID();
    stmt.run(
      id,
      application.status,
      application.message,
      application.propertyId,
      application.applicantId
    );

    return { id, ...application, createdAt: new Date().toISOString() };
  },

  findApplicationsByApplicant(applicantId: string) {
    const stmt = db.prepare('SELECT * FROM applications WHERE applicantId = ?');
    return stmt.all(applicantId);
  },

  findApplicationsByProperty(propertyId: string) {
    const stmt = db.prepare('SELECT * FROM applications WHERE propertyId = ?');
    return stmt.all(propertyId);
  },

  updateApplicationStatus(id: string, status: Application['status']) {
    const stmt = db.prepare(`
      UPDATE applications 
      SET status = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(status, id);
  }
};