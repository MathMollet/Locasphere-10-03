import db from '../src/lib/db';
import { userService } from '../src/services/db/userService';
import { propertyService } from '../src/services/db/propertyService';
import { applicationService } from '../src/services/db/applicationService';
import { tenancyService } from '../src/services/db/tenancyService';
import { documentService } from '../src/services/db/documentService';

const adminCommands = {
  // Commandes utilisateurs
  async createAdmin() {
    const admin = await userService.createUser({
      email: 'admin@izimo.com',
      password: 'admin123', // À changer en production !
      firstName: 'Admin',
      lastName: 'System',
      role: 'owner',
      notificationPreferences: {
        email: true,
        push: true
      }
    });
    console.log('Admin créé:', admin);
  },

  async listUsers() {
    const stmt = db.prepare('SELECT id, email, firstName, lastName, role FROM users');
    const users = stmt.all();
    console.table(users);
  },

  // Commandes propriétés
  async listProperties() {
    const stmt = db.prepare('SELECT id, reference, name, status FROM properties');
    const properties = stmt.all();
    console.table(properties);
  },

  // Commandes statistiques
  async getStats() {
    const stats = {
      users: db.prepare('SELECT COUNT(*) as count FROM users').get(),
      properties: db.prepare('SELECT COUNT(*) as count FROM properties').get(),
      applications: db.prepare('SELECT COUNT(*) as count FROM applications').get(),
      tenancies: db.prepare('SELECT COUNT(*) as count FROM tenancies').get(),
      documents: db.prepare('SELECT COUNT(*) as count FROM documents').get(),
      incidents: db.prepare('SELECT COUNT(*) as count FROM incidents').get(),
    };
    console.log('Statistiques:');
    console.table(stats);
  },

  // Commandes de maintenance
  async cleanupDatabase() {
    // Supprimer les données obsolètes
    const stmt = db.prepare(`
      DELETE FROM notifications 
      WHERE createdAt < datetime('now', '-30 days')
      AND read = 1
    `);
    const result = stmt.run();
    console.log(`${result.changes} notifications supprimées`);
  },

  // Commandes de backup
  async backupDatabase() {
    const backup = db.backup(`backup-${new Date().toISOString()}.db`);
    backup.step(-1); // Copier toute la base
    backup.finish();
    console.log('Backup créé');
  }
};

// Exécution des commandes
async function runCommand(command: keyof typeof adminCommands) {
  console.log(`Exécution de la commande: ${command}`);
  try {
    await adminCommands[command]();
    console.log('Commande exécutée avec succès');
  } catch (error) {
    console.error('Erreur:', error);
  }
}

// Lecture de la commande depuis les arguments
const command = process.argv[2] as keyof typeof adminCommands;
if (command && command in adminCommands) {
  runCommand(command);
} else {
  console.log('Commandes disponibles:');
  console.log(Object.keys(adminCommands).join('\n'));
}