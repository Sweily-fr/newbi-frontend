"use client"

import { Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Line, ComposedChart, Legend } from "recharts"
import { useRevenue } from "../hooks/use-revenue"
import { useExpenses } from "../hooks/use-expenses"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { subDays, subMonths, subYears, format, isAfter, isBefore } from "date-fns"
import { fr } from "date-fns/locale"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DateRange } from 'react-day-picker'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { useState, useMemo } from 'react'

// Types pour les données brutes
interface RawRevenueData {
  date: string | Date;
  total: number;
  count: number;
}

interface RawExpenseData {
  date: string | Date;
  total: number;
}

// Configuration des couleurs
const CHART_COLORS = {
  revenue: "#8b5cf6", // Violet pour le CA
  expense: "#f97316", // Orange pour les dépenses
  average: "#10b981", // Vert pour la moyenne
}

// Composant personnalisé pour le tooltip
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    dataKey: string;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const revenueData = payload.find(item => item.dataKey === 'revenue');
    const expenseData = payload.find(item => item.dataKey === 'expense');
    const averageData = payload.find(item => item.dataKey === 'average');

    return (
      <div className="bg-background border rounded-lg p-4 shadow-lg text-sm">
        <p className="font-medium mb-2">{label}</p>
        {revenueData && (
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: CHART_COLORS.revenue }} />
              <span>CA:</span>
            </div>
            <span className="font-medium">
              {revenueData.value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </span>
          </div>
        )}
        {expenseData && (
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: CHART_COLORS.expense }} />
              <span>Dépenses:</span>
            </div>
            <span className="font-medium">
              {expenseData.value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </span>
          </div>
        )}
        {averageData && (
          <div className="flex items-center justify-between pt-2 mt-2 border-t">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ 
                backgroundColor: CHART_COLORS.average,
                borderRadius: '50%',
                display: 'inline-block'
              }} />
              <span>Moyenne:</span>
            </div>
            <span className="font-medium">
              {averageData.value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

interface RevenueExpensesChartProps {
  className?: string;
}

export function RevenueExpensesChart({ className }: RevenueExpensesChartProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 12),
    to: new Date(),
  });
  
  // Gestion du filtre actif
  const [activeFilter, setActiveFilter] = useState<string>('1y');

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    setActiveFilter('custom');
  };
  
  // Gestion des filtres rapides
  const handleQuickFilter = (filter: string) => {
    const today = new Date();
    let fromDate: Date;
    
    switch(filter) {
      case '7d':
        fromDate = subDays(today, 7);
        break;
      case '30d':
        fromDate = subDays(today, 30);
        break;
      case '90d':
        fromDate = subDays(today, 90);
        break;
      case '6m':
        fromDate = subMonths(today, 6);
        break;
      case '1y':
        fromDate = subYears(today, 1);
        break;
      case 'all':
        setDateRange(undefined);
        setActiveFilter('all');
        return;
      default:
        fromDate = subYears(today, 1);
    }
    
    setDateRange({
      from: fromDate,
      to: today
    });
    setActiveFilter(filter);
  };

  // Utiliser useMemo pour éviter de recalculer les données à chaque rendu
  const { data: revenueData, loading: revenueLoading, error: revenueError } = useRevenue();
  const { data: expensesData, loading: expensesLoading, error: expensesError } = useExpenses();
  
  // Filtrer les données en fonction de la plage de dates sélectionnée
  const filteredData = useMemo(() => {
    const formattedRevenueData = revenueData || [];
    const formattedExpensesData = expensesData || [];
    
    if (!revenueData || !expensesData) return [];

    // Créer un objet pour regrouper les données par mois
    interface MonthData {
      name: string;
      revenue: number;
      expense: number;
      month: Date;
    }
    const dataByMonth: Record<string, MonthData> = {};

    // Traiter les revenus
    (formattedRevenueData as RawRevenueData[]).forEach((item) => {
      if (!item || !item.date) return; // Ignorer les entrées invalides
      
      let date: Date;
      try {
        date = item.date instanceof Date ? item.date : new Date(item.date);
        if (isNaN(date.getTime())) return; // Ignorer les dates invalides
      } catch (e) {
        return; // En cas d'erreur de conversion de date
      }
      
      if (isNaN(date.getTime())) return; // Ignorer les dates invalides
      const monthKey = format(date, 'yyyy-MM');
      
      if (dateRange?.from && isBefore(date, dateRange.from)) return;
      if (dateRange?.to && isAfter(date, dateRange.to)) return;
      
      if (!dataByMonth[monthKey]) {
        dataByMonth[monthKey] = {
          name: format(date, 'MMM yyyy', { locale: fr }),
          revenue: 0,
          expense: 0,
          month: date,
        };
      }
      dataByMonth[monthKey].revenue += item.total;
    });

    // Traiter les dépenses
    (formattedExpensesData as RawExpenseData[]).forEach((item) => {
      if (!item || !item.date) return; // Ignorer les entrées invalides
      
      let date: Date;
      try {
        date = item.date instanceof Date ? item.date : new Date(item.date);
        if (isNaN(date.getTime())) return; // Ignorer les dates invalides
      } catch (e) {
        return; // En cas d'erreur de conversion de date
      }
      
      if (isNaN(date.getTime())) return; // Ignorer les dates invalides
      const monthKey = format(date, 'yyyy-MM');
      
      if (dateRange?.from && isBefore(date, dateRange.from)) return;
      if (dateRange?.to && isAfter(date, dateRange.to)) return;
      
      if (!dataByMonth[monthKey]) {
        dataByMonth[monthKey] = {
          name: format(date, 'MMM yyyy', { locale: fr }),
          revenue: 0,
          expense: 0,
          month: date,
        };
      }
      dataByMonth[monthKey].expense += item.total;
    });

    // Convertir l'objet en tableau et trier par date
    return Object.values(dataByMonth).sort((a, b) => a.month.getTime() - b.month.getTime());
  }, [revenueData, expensesData, dateRange]);

  // Calculer la moyenne des revenus (utilisée dans le graphique)
  const averageRevenue = useMemo(() => {
    if (filteredData.length === 0) return 0;
    const totalRevenue = filteredData.reduce((sum, item) => sum + item.revenue, 0);
    return totalRevenue / filteredData.length;
  }, [filteredData]);
  
  // Cette valeur est utilisée dans le graphique via la propriété 'average' des données
  const loading = revenueLoading || expensesLoading;
  const error = revenueError || expensesError;
  
  // Préparer les données pour le graphique avec les moyennes
  const chartData = filteredData.map(item => ({
    ...item,
    average: averageRevenue // Ligne moyenne pour référence visuelle
  }));

  // La fonction handleDateRangeChange est déjà définie plus haut, donc on la supprime ici

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-sm font-medium">Activité mensuelle</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Chargement des données...
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <DateRangePicker 
              date={dateRange} 
              onDateChange={handleDateRangeChange} 
              className="w-[250px]"
              disabled={true}
            />
          </div>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-sm font-medium">Activité mensuelle</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Erreur lors du chargement des données
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <DateRangePicker 
              date={dateRange} 
              onDateChange={handleDateRangeChange} 
              className="w-[250px]"
              disabled={true}
            />
          </div>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-red-500 text-center">
            Impossible de charger les données: {error.message}
            <br />
            <button 
              onClick={() => window.location.reload()} 
              className="text-primary underline mt-2 inline-block"
            >
              Réessayer
            </button>
          </p>
        </CardContent>
      </Card>
    );
  }

  if (filteredData.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-sm font-medium">Activité mensuelle</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Aucune donnée disponible {dateRange ? 'pour la période sélectionnée' : 'pour les 12 derniers mois'}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <DateRangePicker 
              date={dateRange} 
              onDateChange={handleDateRangeChange} 
              className="w-[250px]"
            />
          </div>
        </CardHeader>
        <CardContent className="h-[300px] flex flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground text-center">
            Aucune donnée trouvée {dateRange ? 'pour la période sélectionnée' : 'pour les 12 derniers mois'}.
          </p>
          {dateRange && (
            <button 
              onClick={() => setDateRange(undefined)} 
              className="text-primary underline text-sm"
            >
              Réinitialiser la période
            </button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-col space-y-4 pb-2">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Activité mensuelle</CardTitle>
            <div className="flex items-center space-x-2">
              <DateRangePicker 
                date={dateRange} 
                onDateChange={handleDateRangeChange} 
                className="w-[200px]"
              />
              {dateRange && (
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setDateRange(undefined);
                    setActiveFilter('all');
                  }} 
                  className="text-xs text-muted-foreground hover:text-primary"
                >
                  Réinitialiser
                </Button>
              )}
            </div>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Comparaison des revenus et dépenses par mois
          </CardDescription>
        </div>
        
        {/* Boutons de filtre rapide */}
        <div className="flex flex-wrap gap-2 pt-2">
          {[
            { id: '7d', label: '7j' },
            { id: '30d', label: '30j' },
            { id: '90d', label: '90j' },
            { id: '6m', label: '6 mois' },
            { id: '1y', label: '1 an' },
            { id: 'all', label: 'Tout' },
          ].map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? 'default' : 'outline'}
              size="sm"
              className={cn(
                'h-7 px-2.5 text-xs',
                activeFilter === filter.id ? 'bg-primary hover:bg-primary/90' : 'bg-background hover:bg-accent hover:text-accent-foreground'
              )}
              onClick={() => handleQuickFilter(filter.id)}
            >
              {filter.label}
            </Button>
          ))}
        </div>

      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tickFormatter={(value) => {
                if (value >= 1000) return `${value / 1000}k`;
                return value;
              }}
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <RechartsTooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
            />
            <Legend 
              verticalAlign="top"
              height={36}
              formatter={(value) => {
                if (value === 'revenue') return 'CA';
                if (value === 'expense') return 'Dépenses';
                if (value === 'average') return 'Moyenne CA';
                return value;
              }}
            />
            <Bar 
              dataKey="revenue" 
              name="CA"
              fill={CHART_COLORS.revenue} 
              radius={[4, 4, 0, 0]}
              barSize={16}
            />
            <Bar 
              dataKey="expense" 
              name="Dépenses"
              fill={CHART_COLORS.expense} 
              radius={[4, 4, 0, 0]}
              barSize={16}
            />
            <Line 
              type="monotone" 
              dataKey="average" 
              name="Moyenne CA"
              stroke={CHART_COLORS.average} 
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 5"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
