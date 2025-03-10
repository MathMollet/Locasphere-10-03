import React, { useState } from 'react';
import { useProperties } from '../hooks/useProperties';
import { Euro, Upload } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import AccountingTable from '../components/accounting/AccountingTable';
import AddExpenseModal from '../components/accounting/AddExpenseModal';

export default function Accounting() {
  const { properties } = useProperties();
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);

  return (
    <div className="p-8">
      <PageHeader
        title="Comptabilité"
        description="Gérez vos revenus locatifs et vos charges"
        action={{
          label: "Ajouter une charge",
          icon: Euro,
          onClick: () => setIsAddExpenseModalOpen(true)
        }}
      />

      <AccountingTable properties={properties} />

      <AddExpenseModal
        isOpen={isAddExpenseModalOpen}
        onClose={() => setIsAddExpenseModalOpen(false)}
        properties={properties}
      />
    </div>
  );
}