import db from '../../lib/db';
import { Incident } from '../../types/incident';

export const incidentService = {
  createIncident(incident: Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>): Incident {
    const stmt = db.prepare(`
      INSERT INTO incidents (
        id, type, status, title, description, photos,
        scheduledDate, estimatedCost, resolution, propertyId
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    stmt.run(
      id,
      incident.type,
      incident.status,
      incident.title,
      incident.description,
      JSON.stringify(incident.photos),
      incident.scheduledDate,
      incident.estimatedCost,
      incident.resolution,
      incident.propertyId
    );

    return {
      id,
      ...incident,
      createdAt: now,
      updatedAt: now
    };
  },

  findIncidentsByProperty(propertyId: string) {
    const stmt = db.prepare('SELECT * FROM incidents WHERE propertyId = ?');
    const incidents = stmt.all(propertyId);
    
    return incidents.map(incident => ({
      ...incident,
      photos: JSON.parse(incident.photos || '[]')
    }));
  },

  updateIncidentStatus(id: string, status: Incident['status']) {
    const stmt = db.prepare(`
      UPDATE incidents 
      SET status = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(status, id);
  },

  updateIncident(id: string, updates: Partial<Incident>) {
    const fields = Object.keys(updates)
      .filter(key => key !== 'id' && key !== 'createdAt' && key !== 'updatedAt')
      .map(key => `${key} = ?`)
      .join(', ');

    const stmt = db.prepare(`
      UPDATE incidents 
      SET ${fields}, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const values = Object.values(updates)
      .filter((_, index) => {
        const key = Object.keys(updates)[index];
        return key !== 'id' && key !== 'createdAt' && key !== 'updatedAt';
      })
      .map(value => {
        if (Array.isArray(value)) return JSON.stringify(value);
        return value;
      });

    stmt.run(...values, id);
  }
};