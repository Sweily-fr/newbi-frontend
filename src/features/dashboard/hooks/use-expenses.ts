import { useQuery } from '@apollo/client';
import { GET_EXPENSES } from '../graphql/queries';
import { useMemo } from 'react';


// Interface pour la réponse de la requête GET_EXPENSES
interface GetExpensesResponse {
  expenses: {
    expenses: Expense[];
    totalCount: number;
    hasNextPage: boolean;
  };
}

// Interface pour les données de dépenses brutes de l'API
interface Expense {
  id: string;
  amount: string;
  vatAmount: string;
  vatRate: string;
  date: string;
  description?: string;
  category?: string;
  currency?: string;
  status?: string;
}

interface ExpenseData {
  name: string;  // Contient le mois au format 'janv. 2023'
  total: number;
  count: number;
}

export function useExpenses() {
    const { data, loading, error } = useQuery<GetExpensesResponse>(GET_EXPENSES, {
      onError: (err) => {
        console.error('Erreur lors de la récupération des dépenses:', err);
      },
      onCompleted: (apiData) => {
        console.log('=== DONNÉES BRUTES DE L\'API ===');
        const dataCopy = JSON.parse(JSON.stringify(apiData));
        
        // Afficher la structure complète des données
        console.log('Structure complète:', dataCopy);
        
        // Vérifier si la structure est celle attendue
        if (!dataCopy.expenses) {
          console.error('La réponse ne contient pas de champ "expenses"');
          return;
        }
        
        console.log('Type de expenses:', typeof dataCopy.expenses);
        
        if (!dataCopy.expenses.expenses) {
          console.error('La réponse ne contient pas de champ "expenses.expenses"');
          return;
        }
        
        console.log('Type de expenses.expenses:', typeof dataCopy.expenses.expenses);
        console.log('Nombre de dépenses:', dataCopy.expenses.expenses?.length || 0);
        
        // Afficher les premières dépenses pour vérifier la structure
        if (dataCopy.expenses.expenses?.length > 0) {
          console.log('=== EXEMPLE DE DONNÉES ===');
          // Afficher les 3 premières dépenses ou moins si moins de 3
          const sampleSize = Math.min(3, dataCopy.expenses.expenses.length);
          for (let i = 0; i < sampleSize; i++) {
            const expense = dataCopy.expenses.expenses[i];
            console.log(`\nDépense ${i + 1}:`);
            console.log('ID:', expense.id);
            console.log('Montant:', expense.amount, 'Type:', typeof expense.amount);
            console.log('Date:', expense.date, 'Type:', typeof expense.date);
            console.log('TVA:', expense.vatAmount, 'Type:', typeof expense.vatAmount);
            console.log('Taux TVA:', expense.vatRate, 'Type:', typeof expense.vatRate);
            console.log('Description:', expense.description);
            console.log('Catégorie:', expense.category);
            console.log('Devise:', expense.currency);
            console.log('Statut:', expense.status);
          }
        } else {
          console.log('Aucune dépense trouvée dans la réponse de l\'API');
        }
      },
      fetchPolicy: 'cache-and-network',
    });
  
    const formattedData = useMemo<ExpenseData[]>(() => {
      console.log('=== DÉBUT DU TRAITEMENT DES DONNÉES ===');
      console.log('Données brutes reçues par useMemo:', data);
      
      if (!data?.expenses?.expenses) {
        console.warn('Aucune donnée de dépenses trouvée ou format inattendu');
        return [];
      }
  
      console.log('Tableau des dépenses reçues:', data.expenses.expenses);
      
      if (!Array.isArray(data.expenses.expenses)) {
        console.error('Les dépenses ne sont pas un tableau:', data.expenses.expenses);
        return [];
      }
      
      if (data.expenses.expenses.length === 0) {
        console.warn('Le tableau des dépenses est vide');
        return [];
      }
  
      // S'assurer que data.expenses.expenses est bien un tableau
      if (!Array.isArray(data.expenses.expenses)) {
        console.error('Les dépenses ne sont pas un tableau:', data.expenses.expenses);
        return [];
      }

      // Vérifier les données avant le traitement
      console.log('=== VÉRIFICATION DES DONNÉES AVANT TRAITEMENT ===');
      console.log('Nombre de dépenses à traiter:', data.expenses.expenses.length);
      
      // Grouper les dépenses par mois
      const monthlyData = (data.expenses.expenses as Expense[]).reduce((acc: Record<string, ExpenseData>, expense: Expense, index: number) => {
        console.log(`\n=== TRAITEMENT DÉPENSE ${index + 1}/${data.expenses.expenses.length} ===`);
        console.log('ID:', expense.id);
        console.log('Montant:', expense.amount);
        console.log('Date brute:', expense.date, 'Type:', typeof expense.date);
        
        try {
          if (!expense.date) {
            console.warn('Dépense sans date, ignorée');
            return acc;
          }
          
          // Gérer les dates qui sont des timestamps (nombres) ou des chaînes de caractères
          let date: Date;
          
          if (typeof expense.date === 'number' || /^\d+$/.test(expense.date)) {
            // Si c'est un timestamp (nombre ou chaîne de chiffres)
            const timestamp = typeof expense.date === 'string' ? parseInt(expense.date, 10) : expense.date;
            date = new Date(timestamp);
          } else {
            // Sinon, essayer de parser comme une date normale
            date = new Date(expense.date);
          }
          
          if (isNaN(date.getTime())) {
            console.error('Date invalide, ignorée:', expense.date, 'Type:', typeof expense.date);
            return acc;
          }
          
          // Formater la date en 'MMM YYYY' (ex: 'janv. 2023') pour l'affichage
          const monthYear = date.toLocaleDateString('fr-FR', { 
            month: 'short',
            year: 'numeric'
          });
          
          // Créer une clé de tri basée sur l'année et le mois (ex: '2023-01')
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const sortKey = `${year}-${month}`;
  
          console.log('Date formatée:', monthYear, 'Clé de tri:', sortKey);
  
          if (!acc[sortKey]) {
            console.log('Nouveau mois détecté:', monthYear, 'Clé:', sortKey);
            acc[sortKey] = {
              name: monthYear,
              total: 0,
              count: 0
            };
          }
  
          // Calculer le montant TTC à partir du montant HT et de la TVA
          const montantHT = parseFloat(expense.amount) || 0;
          const montantTVA = parseFloat(expense.vatAmount) || 0;
          const tauxTVA = parseFloat(expense.vatRate) || 0;
          
          console.log('Calcul des montants:', {
            montantHT,
            montantTVA,
            tauxTVA
          });
          
          // Si le montant TVA n'est pas fourni mais que le taux l'est, on le calcule
          const tvaCalculee = montantTVA > 0 ? montantTVA : montantHT * (tauxTVA / 100);
          const montantTTC = montantHT + tvaCalculee;
          
          console.log('Résultats du calcul:', {
            tvaCalculee,
            montantTTC,
            'total avant ajout': acc[sortKey].total,
            'nouveau total': acc[sortKey].total + montantTTC,
            'clé utilisée': sortKey
          });
          
          // Utiliser la même clé (sortKey) pour accéder à l'accumulateur
          acc[sortKey].total += montantTTC;
          acc[sortKey].count += 1;
          
          console.log('État actuel de l\'accumulateur:', JSON.parse(JSON.stringify(acc)));
        } catch (error) {
          console.error('Erreur lors du traitement de la date:', error, 'Date:', expense.date);
        }
  
        return acc;
      }, {});
  
      console.log('\n=== DONNÉES AVANT TRI ===');
      console.log(JSON.stringify(monthlyData, null, 2));
      
      // Convertir l'objet en tableau et typer correctement
      const monthlyDataArray = Object.entries(monthlyData).map(([sortKey, data]) => ({
        name: data.name,
        total: data.total,
        count: data.count,
        sortKey // Ajouter la clé de tri à chaque élément
      }));
      
      // Trier par la clé de tri (format 'YYYY-MM')
      const sortedData = monthlyDataArray
        .sort((a, b) => {
          try {
            const result = a.sortKey.localeCompare(b.sortKey);
            console.log(`Tri: ${a.sortKey} vs ${b.sortKey} = ${result}`);
            return result;
          } catch (error) {
            console.error('Erreur lors du tri des dates:', error);
            return 0;
          }
        })
        .map((item) => {
          const formattedItem: ExpenseData = {
            name: item.name,
            total: Number(item.total.toFixed(2)),
            count: item.count
          };
          console.log('Élément formaté:', formattedItem);
          return formattedItem;
        });
  
      console.log('\n=== DONNÉES TRIÉES ET FORMATÉES ===');
      console.log(JSON.stringify(sortedData, null, 2));
      return sortedData;
    }, [data]);
  
    return {
      data: formattedData,
      loading,
      error
    };
  }