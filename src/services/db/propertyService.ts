import db from '../../lib/db';
import { Property } from '../../types/property';

export const propertyService = {
  createProperty(property: Omit<Property, 'id' | 'createdAt'>): Property {
    const stmt = db.prepare(`
      INSERT INTO properties (
        id, reference, name, type, address, city, postalCode,
        surface, rentAmount, status, description, photos,
        isFurnished, isSharedLiving, constructionYear,
        numberOfRooms, numberOfBedrooms, numberOfBathrooms,
        energyClass, gesClass, baseRent, charges, deposit,
        availableFrom, tenantCriteria, ownerId
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const id = crypto.randomUUID();
    stmt.run(
      id,
      property.reference,
      property.name,
      property.type,
      property.address,
      property.city,
      property.postalCode,
      property.surface,
      property.rentAmount,
      property.status,
      property.description,
      JSON.stringify(property.photos),
      property.isFurnished ? 1 : 0,
      property.isSharedLiving ? 1 : 0,
      property.constructionYear,
      property.numberOfRooms,
      property.numberOfBedrooms,
      property.numberOfBathrooms,
      property.energyClass,
      property.gesClass,
      property.baseRent,
      property.charges,
      property.deposit,
      property.availableFrom?.toISOString(),
      property.tenantCriteria ? JSON.stringify(property.tenantCriteria) : null,
      property.ownerId
    );

    return { id, ...property, createdAt: new Date().toISOString() };
  },

  findPropertyByReference(reference: string) {
    const stmt = db.prepare('SELECT * FROM properties WHERE reference = ? AND status = "available"');
    const property = stmt.get(reference);
    
    if (!property) return null;
    
    return {
      ...property,
      photos: JSON.parse(property.photos || '[]'),
      tenantCriteria: property.tenantCriteria ? JSON.parse(property.tenantCriteria) : null,
      isFurnished: Boolean(property.isFurnished),
      isSharedLiving: Boolean(property.isSharedLiving),
    };
  },

  searchProperties(filters: {
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    minSurface?: number;
    maxSurface?: number;
    rooms?: number;
  }) {
    let query = 'SELECT * FROM properties WHERE status = "available"';
    const params = [];

    if (filters.city) {
      query += ' AND city LIKE ?';
      params.push(`%${filters.city}%`);
    }

    if (filters.minPrice) {
      query += ' AND (rentAmount + charges) >= ?';
      params.push(filters.minPrice);
    }

    if (filters.maxPrice) {
      query += ' AND (rentAmount + charges) <= ?';
      params.push(filters.maxPrice);
    }

    if (filters.minSurface) {
      query += ' AND surface >= ?';
      params.push(filters.minSurface);
    }

    if (filters.maxSurface) {
      query += ' AND surface <= ?';
      params.push(filters.maxSurface);
    }

    if (filters.rooms) {
      query += ' AND numberOfRooms = ?';
      params.push(filters.rooms);
    }

    const stmt = db.prepare(query);
    const properties = stmt.all(...params);

    return properties.map(property => ({
      ...property,
      photos: JSON.parse(property.photos || '[]'),
      tenantCriteria: property.tenantCriteria ? JSON.parse(property.tenantCriteria) : null,
      isFurnished: Boolean(property.isFurnished),
      isSharedLiving: Boolean(property.isSharedLiving),
    }));
  }
};