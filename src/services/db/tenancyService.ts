import db from '../../lib/db';
import { Tenancy } from '../../types/tenancy';

export const tenancyService = {
  createTenancy(tenancy: Omit<Tenancy, 'id' | 'createdAt'>): Tenancy {
    const stmt = db.prepare(`
      INSERT INTO tenancies (
        id, startDate, endDate, status, propertyId, tenantId
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const id = crypto.randomUUID();
    stmt.run(
      id,
      tenancy.startDate,
      tenancy.endDate,
      tenancy.status,
      tenancy.propertyId,
      tenancy.tenantId
    );

    return { id, ...tenancy, createdAt: new Date().toISOString() };
  },

  findTenancyByTenant(tenantId: string) {
    const stmt = db.prepare('SELECT * FROM tenancies WHERE tenantId = ? AND status = "active"');
    return stmt.get(tenantId);
  },

  findTenanciesByProperty(propertyId: string) {
    const stmt = db.prepare('SELECT * FROM tenancies WHERE propertyId = ?');
    return stmt.all(propertyId);
  },

  updateTenancyStatus(id: string, status: Tenancy['status']) {
    const stmt = db.prepare(`
      UPDATE tenancies 
      SET status = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(status, id);
  }
};