import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import PurchaseOrdersPageComponent from '../features/bons-de-commande/components/business/PurchaseOrdersPage';

/**
 * Page principale des bons de commande
 */
const PurchaseOrdersPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const sidebarId = searchParams.get('id') || id;

  return <PurchaseOrdersPageComponent />;
};

export default PurchaseOrdersPage;
