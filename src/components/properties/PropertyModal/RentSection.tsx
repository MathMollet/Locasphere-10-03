import React from 'react';
import InputField from '../../forms/InputField';
import { PropertyFormData } from '../../../types/property';

interface RentSectionProps {
  formData: PropertyFormData;
  setFormData: (data: PropertyFormData) => void;
}

export default function RentSection({ formData, setFormData }: RentSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <InputField
          label="Loyer de base (€)"
          type="number"
          value={formData.baseRent.toString()}
          onChange={(value) => setFormData({ ...formData, baseRent: Number(value) })}
          required
        />
        <InputField
          label="Charges (€)"
          type="number"
          value={formData.charges.toString()}
          onChange={(value) => setFormData({ ...formData, charges: Number(value) })}
          required
        />
        <InputField
          label="Dépôt de garantie (€)"
          type="number"
          value={formData.deposit.toString()}
          onChange={(value) => setFormData({ ...formData, deposit: Number(value) })}
          required
        />
      </div>
    </div>
  );
}