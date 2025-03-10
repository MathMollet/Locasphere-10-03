import React, { useState, useEffect } from 'react';
import { Database, Download, Trash2, Search, Filter, RefreshCw } from 'lucide-react';
import { storage } from '../utils/storage';
import { initDataService } from '../services/initDataService';
import ConfirmationModal from '../components/common/ConfirmationModal';

interface TableData {
  key: string;
  data: any[];
  columns: string[];
}

export default function DbAdmin() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [initializationResult, setInitializationResult] = useState<any>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    table: string | null;
    rowIndex: number | null;
  }>({
    isOpen: false,
    table: null,
    rowIndex: null,
  });

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = () => {
    const storageData = Object.keys(localStorage)
      .filter(key => key.startsWith('izimo_'))
      .map(key => {
        try {
          const rawData = JSON.parse(localStorage.getItem(key) || '[]');
          const data = Array.isArray(rawData) ? rawData : [rawData];
          let columns = data.length > 0 ? Object.keys(data[0]) : [];
          
          // Ajouter les colonnes des commentaires pour les incidents
          if (key === 'izimo_incidents' && data.length > 0) {
            if (data[0].comments) {
              columns = columns.filter(col => col !== 'comments');
              columns.push('commentsCount');
            }
          }
          
          return { key, data, columns };
        } catch (e) {
          return { key, data: [], columns: [] };
        }
      });
    
    setTables(storageData);
    if (storageData.length > 0 && !selectedTable) {
      setSelectedTable(storageData[0].key);
    }
  };

  const formatTableData = (tableKey: string, data: any[]) => {
    if (tableKey === 'izimo_incidents') {
      return data.map(incident => ({
        ...incident,
        commentsCount: incident.comments?.length || 0,
        comments: undefined // Ne pas afficher le tableau de commentaires
      }));
    }
    return data;
  };
  const handleExportCSV = (tableData: TableData) => {
    const headers = tableData.columns.join(',');
    const rows = tableData.data.map(row => 
      tableData.columns.map(col => JSON.stringify(row[col])).join(',')
    );
    const csv = [headers, ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tableData.key}_${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportAllData = () => {
    const data = tables.reduce((acc, table) => ({
      ...acc,
      [table.key]: table.data
    }), {});
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `izimo_data_${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (window.confirm('Êtes-vous sûr de vouloir effacer toutes les données ?')) {
      tables.forEach(table => storage.remove(table.key));
      setTables([]);
      setSelectedTable(null);
    }
  };

  const handleInitializeTestData = () => {
    if (window.confirm('Voulez-vous initialiser les données de test ? Cela remplacera les données existantes.')) {
      const result = initDataService.initializeTestData();
      setInitializationResult(result);
      loadTables();
    }
  };

  const handleDeleteRow = (tableKey: string, rowIndex: number) => {
    setDeleteConfirmation({
      isOpen: true,
      table: tableKey,
      rowIndex: rowIndex,
    });
  };

  const confirmDeleteRow = () => {
    if (deleteConfirmation.table && deleteConfirmation.rowIndex !== null) {
      const tableData = tables.find(t => t.key === deleteConfirmation.table);
      if (tableData) {
        const newData = [...tableData.data];
        newData.splice(deleteConfirmation.rowIndex, 1);
        storage.set(deleteConfirmation.table, newData);
        loadTables();
      }
    }
    setDeleteConfirmation({ isOpen: false, table: null, rowIndex: null });
  };

  const selectedTableData = tables.find(t => t.key === selectedTable);

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Administration des données
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Visualisez et gérez les données de l'application
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleInitializeTestData}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500"
            >
              <RefreshCw className="h-5 w-5" />
              Initialiser les données de test
            </button>
            <button
              onClick={handleExportAllData}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
            >
              <Download className="h-5 w-5" />
              Exporter tout
            </button>
            <button
              onClick={handleClearData}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500"
            >
              <Trash2 className="h-5 w-5" />
              Effacer tout
            </button>
          </div>
        </div>

        {initializationResult && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/50 rounded-lg">
            <h3 className="font-semibold text-green-900 dark:text-green-100">
              {initializationResult.message}
            </h3>
            <div className="mt-2 text-sm text-green-700 dark:text-green-300">
              <p>Données créées :</p>
              <ul className="list-disc list-inside">
                <li>{initializationResult.stats.users} utilisateurs</li>
                <li>{initializationResult.stats.properties} biens</li>
                <li>{initializationResult.stats.applications} candidatures</li>
                <li>{initializationResult.stats.tenants} locataires</li>
                <li>{initializationResult.stats.incidents} incidents</li>
              </ul>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Liste des tables */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Database className="h-5 w-5 text-indigo-500" />
              Tables
            </h2>
            <div className="space-y-2">
              {tables.map(table => (
                <button
                  key={table.key}
                  onClick={() => setSelectedTable(table.key)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                    selectedTable === table.key
                      ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {table.key.replace('izimo_', '')}
                  <span className="ml-2 text-xs text-gray-500">
                    ({table.data.length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Contenu de la table */}
          <div className="md:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            {selectedTableData ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedTableData.key.replace('izimo_', '')}
                  </h2>
                  <div className="flex gap-4">
                    <div className="relative">
                      <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <button
                      onClick={() => handleExportCSV(selectedTableData)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
                    >
                      <Download className="h-5 w-5" />
                      Exporter CSV
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                        {selectedTableData.columns.map(column => (
                          <th
                            key={column}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {selectedTableData.data
                        .filter(row => 
                          Object.values(row).some(value => 
                            String(value).toLowerCase().includes(searchTerm.toLowerCase())
                          )
                        )
                        .map((row, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => handleDeleteRow(selectedTableData.key, index)}
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                title="Supprimer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                            {selectedTableData.columns.map(column => (
                              <td
                                key={column}
                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                              >
                                {typeof row[column] === 'object'
                                  ? JSON.stringify(row[column])
                                  : String(row[column])}
                              </td>
                            ))}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                Sélectionnez une table pour voir les données
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, table: null, rowIndex: null })}
        onConfirm={confirmDeleteRow}
        title="Supprimer l'entrée"
        message="Êtes-vous sûr de vouloir supprimer cette entrée ? Cette action est irréversible."
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
      />
    </div>
  );
}