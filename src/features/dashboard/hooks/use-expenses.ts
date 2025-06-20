import { useQuery } from '@apollo/client';
import { GET_EXPENSES } from '../graphql/queries';
import { useMemo } from 'react';

interface ExpenseData {
  name: string;
  total: number;
  count: number;
}

export function useExpenses() {
    const { data, loading, error } = useQuery(GET_EXPENSES);
  
    const formattedData = useMemo<ExpenseData[]>(() => {
      if (!data?.expenses?.expenses) return [];
  
      console.log('Données brutes des dépenses:', data.expenses.expenses);
  
      // Grouper les dépenses par mois
      const monthlyData = data.expenses.expenses.reduce((acc: Record<string, ExpenseData>, expense: any) => {
        console.log('Date brute:', expense.date, 'Type:', typeof expense.date);
        
        try {
          const date = new Date(expense.date);
          if (isNaN(date.getTime())) {
            console.error('Date invalide:', expense.date);
            return acc;
          }
          
          const monthYear = date.toLocaleDateString('fr-FR', { 
            month: 'short', 
            year: 'numeric' 
          });
  
          if (!acc[monthYear]) {
            acc[monthYear] = {
              name: monthYear,
              total: 0,
              count: 0
            };
          }
  
          acc[monthYear].total += expense.amount;
          acc[monthYear].count += 1;
        } catch (error) {
          console.error('Erreur lors du traitement de la date:', error, 'Date:', expense.date);
        }
  
        return acc;
      }, {});
  
      // Trier par date
      const sortedData = Object.values(monthlyData)
        .sort((a, b) => {
          try {
            const dateA = new Date(a.name);
            const dateB = new Date(b.name);
            return dateA.getTime() - dateB.getTime();
          } catch (error) {
            console.error('Erreur lors du tri des dates:', error);
            return 0;
          }
        })
        .map(item => ({
          ...item,
          total: Number(item.total.toFixed(2))
        }));
  
      console.log('Données formatées:', sortedData);
      return sortedData;
    }, [data]);
  
    return {
      data: formattedData,
      loading,
      error
    };
  }