import { useQuery } from '@apollo/client';
import { GET_SUPPLIERS } from '../graphql/suppliers';
import { Supplier } from '../types/supplier';

interface SuppliersData {
  suppliers: Supplier[];
}

export const useSuppliers = () => {
  const { data, loading, error, refetch } = useQuery<SuppliersData>(GET_SUPPLIERS, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    data: data?.suppliers || [],
    loading,
    error,
    refetch,
  };
};
