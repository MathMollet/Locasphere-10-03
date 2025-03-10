import db from '../../lib/db';
import { Document } from '../../types/tenant';

export const documentService = {
  createDocument(document: Omit<Document, 'id' | 'uploadedAt'>): Document {
    const stmt = db.prepare(`
      INSERT INTO documents (
        id, type, name, url, propertyId, tenancyId, applicationId
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const id = crypto.randomUUID();
    stmt.run(
      id,
      document.type,
      document.name,
      document.url,
      document.propertyId,
      document.tenancyId,
      document.applicationId
    );

    return {
      id,
      ...document,
      uploadedAt: new Date().toISOString()
    };
  },

  findDocumentsByProperty(propertyId: string) {
    const stmt = db.prepare('SELECT * FROM documents WHERE propertyId = ?');
    return stmt.all(propertyId);
  },

  findDocumentsByTenancy(tenancyId: string) {
    const stmt = db.prepare('SELECT * FROM documents WHERE tenancyId = ?');
    return stmt.all(tenancyId);
  },

  findDocumentsByApplication(applicationId: string) {
    const stmt = db.prepare('SELECT * FROM documents WHERE applicationId = ?');
    return stmt.all(applicationId);
  },

  deleteDocument(id: string) {
    const stmt = db.prepare('DELETE FROM documents WHERE id = ?');
    stmt.run(id);
  }
};