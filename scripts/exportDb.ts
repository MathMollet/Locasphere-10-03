import { createClient } from '@libsql/client';
import * as XLSX from 'xlsx';
import { join } from 'path';

const db = createClient({
  url: 'file:data.db',
});

// Liste des tables à exporter
const tables = [
  'users',
  'properties',
  'tenancies',
  'applications',
  'documents',
  'messages',
  'notifications',
  'incidents'
];

// Fonction pour obtenir les données d'une table
async function getTableData(tableName: string) {
  const result = await db.execute(`SELECT * FROM ${tableName}`);
  return result.rows;
}

// Fonction pour nettoyer les données sensibles
function sanitizeData(data: any[], tableName: string) {
  return data.map(row => {
    const cleanRow = { ...row };
    
    // Supprimer les mots de passe
    if (tableName === 'users') {
      delete cleanRow.password;
    }

    // Convertir les JSON strings en objets
    for (const key in cleanRow) {
      try {
        if (typeof cleanRow[key] === 'string' && 
            (cleanRow[key].startsWith('[') || cleanRow[key].startsWith('{'))) {
          cleanRow[key] = JSON.parse(cleanRow[key]);
        }
      } catch (e) {
        // Garder la valeur originale si ce n'est pas du JSON valide
      }
    }

    return cleanRow;
  });
}

// Fonction principale d'export
async function exportToExcel() {
  const workbook = XLSX.utils.book_new();
  
  // Créer une feuille pour chaque table
  for (const table of tables) {
    try {
      console.log(`Exportation de la table ${table}...`);
      
      // Récupérer et nettoyer les données
      const data = await getTableData(table);
      const cleanData = sanitizeData(data, table);
      
      // Créer une feuille Excel
      const worksheet = XLSX.utils.json_to_sheet(cleanData);
      
      // Ajouter la feuille au classeur
      XLSX.utils.book_append_sheet(workbook, worksheet, table);
      
    } catch (error) {
      console.error(`Erreur lors de l'exportation de ${table}:`, error);
    }
  }

  // Générer le nom du fichier avec la date
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `izimo_export_${timestamp}.xlsx`;
  const filepath = join(process.cwd(), filename);

  // Sauvegarder le fichier
  XLSX.writeFile(workbook, filepath);
  console.log(`Export terminé: ${filepath}`);
}

// Exécuter l'export
exportToExcel().catch(console.error);