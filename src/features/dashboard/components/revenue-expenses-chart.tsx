"use client"

import { Bar, BarChart, CartesianGrid, XAxis, Tooltip } from "recharts"
import { useRevenue } from "../hooks/use-revenue"
import { useExpenses } from "../hooks/use-expenses"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useMemo, useState } from 'react'
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const chartConfig = {
  revenue: {
    label: "CA",
    color: "hsl(142.1, 76.2%, 36.3%)",
  },
  expense: {
    label: "Dépenses",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig

// Options pour le filtre de période
const PERIOD_OPTIONS = [
  { value: '12', label: '12 derniers mois' },
  { value: '6', label: '6 derniers mois' },
  { value: '3', label: '3 derniers mois' },
  { value: '1', label: '30 derniers jours' },
] as const;

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

    return (
      <div className="bg-background border rounded-lg p-4 shadow-lg text-sm">
        <p className="font-medium mb-2">{label}</p>
        {revenueData && (
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: chartConfig.revenue.color }} />
              <span>CA:</span>
            </div>
            <span className="font-medium">
              {revenueData.value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </span>
          </div>
        )}
        {expenseData && (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: chartConfig.expense.color }} />
              <span>Dépenses:</span>
            </div>
            <span className="font-medium">
              {expenseData.value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
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
  const [selectedPeriod, setSelectedPeriod] = useState('12');
  const { data: revenueData, loading: revenueLoading, error: revenueError, refreshData: refreshRevenue } = useRevenue({ months: selectedPeriod as '1' | '3' | '6' | '12' });
  const { data: expensesData, loading: expensesLoading, error: expensesError, refreshData: refreshExpenses } = useExpenses({ months: selectedPeriod as '1' | '3' | '6' | '12' });
  
  // Recharger les données lorsque la période change
  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    refreshRevenue();
    refreshExpenses();
  };
  
  const chartData = useMemo(() => {
    if (!revenueData || !expensesData) return [];

    const dataByMonth: Record<string, { name: string; revenue: number; expense: number }> = {};

    // Traiter les revenus
    (revenueData as Array<{ date: string | Date; total: number }>).forEach((item) => {
      if (!item?.date) return;
      
      const date = item.date instanceof Date ? item.date : new Date(item.date);
      if (isNaN(date.getTime())) return;
      
      const monthKey = format(date, 'yyyy-MM');
      
      if (!dataByMonth[monthKey]) {
        dataByMonth[monthKey] = {
          name: format(date, 'MMM yyyy', { locale: fr }),
          revenue: 0,
          expense: 0
        };
      }
      
      dataByMonth[monthKey].revenue += item.total || 0;
    });

    // Traiter les dépenses
    (expensesData as Array<{ date: string | Date; total: number }>).forEach((item) => {
      if (!item?.date) return;
      
      const date = item.date instanceof Date ? item.date : new Date(item.date);
      if (isNaN(date.getTime())) return;
      
      const monthKey = format(date, 'yyyy-MM');
      
      if (!dataByMonth[monthKey]) {
        dataByMonth[monthKey] = {
          name: format(date, 'MMM yyyy', { locale: fr }),
          revenue: 0,
          expense: 0
        };
      }
      
      dataByMonth[monthKey].expense += item.total || 0;
    });

    // Trier les données par date
    return Object.values(dataByMonth).sort((a, b) => {
      const dateA = new Date(a.name);
      const dateB = new Date(b.name);
      return dateA.getTime() - dateB.getTime();
    });
  }, [revenueData, expensesData]);

  if (revenueLoading || expensesLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (revenueError || expensesError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erreur</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Une erreur est survenue lors du chargement des données.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-base font-semibold">CA et Dépenses</CardTitle>
          <CardDescription className="text-sm">
            Évolution sur {selectedPeriod} {selectedPeriod === '1' ? 'mois' : 'derniers mois'}
          </CardDescription>
        </div>
        <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
          <SelectTrigger className="hidden w-[160px] rounded-lg sm:flex h-8" aria-label="Sélectionner une période">
            <SelectValue placeholder="Sélectionner une période" />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value} className="rounded-lg">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="h-[300px] w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart 
              data={chartData}
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={8}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="revenue" 
                fill="hsl(142.1, 76.2%, 36.3%)" 
                radius={[4, 4, 0, 0]} 
                name="CA"
                barSize={16}
              />
              <Bar 
                dataKey="expense" 
                fill="hsl(var(--destructive))" 
                radius={[4, 4, 0, 0]} 
                name="Dépenses"
                barSize={16}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Vue d'ensemble de votre activité
            </div>
            <div className="text-xs text-muted-foreground">
              Comparaison entre votre chiffre d'affaires et vos dépenses
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
