import { useQuery } from '@apollo/client';
import { GET_COMPLETED_INVOICES } from '../graphql/queries';
import { useMemo } from 'react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';

// Interface pour la réponse de la requête GET_COMPLETED_INVOICES
interface GetCompletedInvoicesResponse {
  invoices: {
    invoices: Invoice[];
    totalCount: number;
  };
}

// Interface pour les données de facturation brutes de l'API
interface Invoice {
  id: string;
  number: string;
  issueDate: string;
  totalTTC: number;
  totalHT: number;
  totalVAT: number;
  status: string; // Ajout du statut
  client: {
    id: string;
    name: string;
  };
}

interface RevenueData {
  name: string;  // Contient le mois au format 'janv. 2023'
  total: number;
  count: number;
  date: Date; // Pour le tri
}

export function useRevenue() {
  // Définir la plage de dates pour les 12 derniers mois
  const endDate = endOfMonth(new Date());
  const startDate = startOfMonth(subMonths(new Date(), 11)); // 12 mois de données

  const { data, loading, error } = useQuery<GetCompletedInvoicesResponse>(GET_COMPLETED_INVOICES, {
    variables: {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    },
    onError: (err) => {
      console.error('Erreur lors de la récupération des factures:', err);
    },
    onCompleted: (apiData) => {
      console.log('=== DONNÉES BRUTES DES FACTURES ===');
      console.log('Données reçues:', apiData);
      
      // Log des premières factures pour vérification
      if (apiData?.invoices?.invoices && apiData.invoices.invoices.length > 0) {
        console.log('=== PREMIÈRES FACTURES ===');
        apiData.invoices.invoices.slice(0, 3).forEach((invoice, index) => {
          console.log(`Facture #${index + 1}:`, {
            id: invoice.id,
            number: invoice.number,
            issueDate: invoice.issueDate,
            totalTTC: invoice.totalTTC,
            status: invoice.status
          });
        });
        console.log(`Total: ${apiData.invoices.invoices.length} factures`);
        console.log('=== FIN DES FACTURES ===');
      } else {
        console.log('Aucune facture trouvée pour la période sélectionnée');
      }
    },
    fetchPolicy: 'cache-and-network',
  });

  // Calculer le total du chiffre d'affaires et le nombre total de factures
  const { totalRevenue, totalInvoices } = useMemo(() => {
    if (!data?.invoices?.invoices || !Array.isArray(data.invoices.invoices)) {
      return { totalRevenue: 0, totalInvoices: 0 };
    }
    
    // Calculer le total à partir des factures
    const total = data.invoices.invoices.reduce((sum: number, invoice: Invoice) => {
      return sum + (invoice.totalTTC || 0);
    }, 0);
    
    return {
      totalRevenue: total,
      totalInvoices: data.invoices.totalCount || data.invoices.invoices.length
    };
  }, [data]);

  // Formater les données pour le graphique
  const formattedData = useMemo<RevenueData[]>(() => {
    if (!data?.invoices?.invoices || !Array.isArray(data.invoices.invoices)) {
      console.log('Aucune donnée de facture disponible');
      return [];
    }
    
    console.log(`Traitement de ${data.invoices.invoices.length} factures`);
    
    // Grouper les factures par mois
    const monthlyData = data.invoices.invoices.reduce<Record<string, { total: number; count: number }>>((acc, invoice: Invoice) => {
      if (!invoice.issueDate) return acc;
      
      try {
        // Vérifier si la date est valide
        const date = new Date(invoice.issueDate);
        if (isNaN(date.getTime())) {
          console.warn('Date de facture invalide:', invoice.issueDate, 'dans la facture', invoice.id);
          return acc;
        }
        
        const monthKey = format(date, 'yyyy-MM');
        
        if (!acc[monthKey]) {
          acc[monthKey] = { total: 0, count: 0 };
        }
        
        // Ajouter le montant TTC (en s'assurant que c'est un nombre valide)
        const amount = Number(invoice.totalTTC) || 0;
        acc[monthKey].total += amount;
        acc[monthKey].count += 1;
      } catch (error) {
        console.error('Erreur lors du traitement de la facture:', invoice.id, error);
      }
      
      return acc;
    }, {});
    
    // S'assurer que tous les mois sont représentés, même sans données
    const allMonths: Record<string, RevenueData> = {};
    const currentDate = new Date(startDate);
    const endDateObj = new Date(endDate);
    
    // Vérifier que les dates sont valides
    if (isNaN(currentDate.getTime()) || isNaN(endDateObj.getTime())) {
      console.error('Dates de période invalides:', { startDate, endDate });
      return [];
    }
    
    // Créer une copie de la date pour éviter de modifier l'originale
    const current = new Date(currentDate);
    
    while (current <= endDateObj) {
      try {
        const monthKey = format(current, 'yyyy-MM');
        const monthName = format(current, 'MMM yyyy', { locale: fr });
        
        allMonths[monthKey] = {
          name: monthName,
          total: monthlyData[monthKey]?.total || 0,
          count: monthlyData[monthKey]?.count || 0,
          date: new Date(current) // Créer une nouvelle instance de Date
        };
      } catch (error) {
        console.error('Erreur lors du formatage du mois:', current, error);
      }
      
      // Passer au mois suivant de manière sûre
      current.setMonth(current.getMonth() + 1);
    }
    
    // Convertir en tableau et trier par date
    const sortedData = Object.values(allMonths).sort((a, b) => a.date.getTime() - b.date.getTime());
    
    console.log('Données formatées pour le graphique:', {
      data: sortedData,
      totalRevenue,
      totalInvoices
    });

    return sortedData;
  }, [data, startDate, endDate, totalRevenue, totalInvoices]); // Ajout des dépendances manquantes

  return {
    data: formattedData,
    loading,
    error,
    totalRevenue,
    totalInvoices
  };
}
