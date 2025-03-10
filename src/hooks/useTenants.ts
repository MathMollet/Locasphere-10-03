import { useState } from 'react';
import { Tenant } from '../types/tenant';
import { useNavigate } from 'react-router-dom';

const initialTenants: Tenant[] = [];

export function useTenants() {
  const [tenants] = useState<Tenant[]>(initialTenants);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const openChat = (tenantId: string) => {
    navigate(`/chat?tenant=${tenantId}`);
  };

  return {
    tenants,
    selectedTenant,
    setSelectedTenant,
    isModalOpen,
    setIsModalOpen,
    openChat,
  };
}