import React from 'react';
import { Select } from '../../../../../components/ui';

interface InvoiceStatusProps {
  status: string;
  setStatus: (value: string) => void;
  register?: any;
  error?: any;
}

export const InvoiceStatus: React.FC<InvoiceStatusProps> = ({
  status,
  setStatus,
  register,
  error
}) => {
  return (
    <div className="mb-6">
      <Select
        id="invoice-status"
        name="status"
        label="Statut"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        register={register}
        error={error}
        options={[
          { value: 'DRAFT', label: 'Brouillon' },
          { value: 'PENDING', label: 'En attente' },
          { value: 'COMPLETED', label: 'Terminée' }
        ]}
      />
    </div>
  );
};
