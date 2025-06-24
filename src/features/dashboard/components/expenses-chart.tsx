"use client"

import React from 'react';
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useExpenses } from "../hooks/use-expenses"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  expenses: {
    label: "Dépenses",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

const PERIOD_OPTIONS = [
  { value: '12', label: '12 derniers mois' },
  { value: '6', label: '6 derniers mois' },
  { value: '3', label: '3 derniers mois' },
  { value: '1', label: '30 derniers jours' },
] as const;

export function ExpensesChart() {
  const [selectedPeriod, setSelectedPeriod] = React.useState<string>('12');
  const { 
    data: expenses, 
    loading, 
    error,
    totalExpenses,
    refreshData 
  } = useExpenses({ months: selectedPeriod as '1' | '3' | '6' | '12' });
  
  // Recharger les données lorsque la période change
  React.useEffect(() => {
    refreshData();
  }, [selectedPeriod, refreshData]);
  
  // Formater le montant total des dépenses
  const formattedTotalExpenses = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(totalExpenses || 0);

  // Définir le type des données du graphique
  interface ChartDataPoint {
    name: string;
    value: number;
    count: number;
    total: number;
    month: string;
  }

  // Formater les données pour le graphique
  const chartData = React.useMemo<ChartDataPoint[]>(() => {
    if (!expenses || !Array.isArray(expenses)) return [];
    
    return expenses.map(expense => ({
      name: expense.name || 'Mois inconnu',
      value: expense.total || 0,
      count: expense.count || 0,
      total: expense.total || 0,
      month: expense.name || 'Mois inconnu'
    }));
  }, [expenses]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-destructive">
            Erreur de chargement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Impossible de charger les données des dépenses: {error.message}</p>
        </CardContent>
      </Card>
    )
  }

  if (!expenses || expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dépenses mensuelles</CardTitle>
          <CardDescription>
            Aucune donnée de dépenses disponible
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground text-center">
            Les dépenses apparaîtront ici une fois ajoutées
          </p>
        </CardContent>
      </Card>
    )
  }

  console.log('=== DONNÉES POUR LE GRAPHIQUE ===');
  console.log('Nombre d\'entrées:', chartData.length);
  console.log('Première entrée:', chartData[0]);
  console.log('Toutes les données:', JSON.stringify(chartData, null, 2));
  console.log('=== FIN DES DONNÉES POUR LE GRAPHIQUE ===');

  // Si pas de données, afficher un message
  if (!chartData || chartData.length === 0 || chartData.every(item => item.value === 0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dépenses mensuelles</CardTitle>
          <CardDescription>
            Aucune donnée de dépenses disponible
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground text-center">
            Aucune dépense trouvée pour la période sélectionnée
          </p>
        </CardContent>
      </Card>
    );
  }

  // Trier les données par date (le hook useExpenses renvoie déjà les données triées par date)
  const sortedData = [...chartData];

  // Définir le type de retour de la fonction calculateTrend
  interface TrendData {
    percentage: number;
    isPositive: boolean;
  }

  // Calculer la variation mensuelle
  const calculateTrend = (): TrendData => {
    if (sortedData.length < 2) return { percentage: 0, isPositive: true };
    
    const lastMonth = sortedData[sortedData.length - 1].value;
    const prevMonth = sortedData[sortedData.length - 2].value;
    const percentage = prevMonth !== 0 ? ((lastMonth - prevMonth) / prevMonth) * 100 : 0;
    
    return {
      percentage: Number(Math.abs(percentage).toFixed(1)),
      isPositive: percentage >= 0
    };
  };

  const trend = calculateTrend();
  const currentYear = new Date().getFullYear();

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-semibold">Dépenses mensuelles</CardTitle>
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="font-medium">{formattedTotalExpenses}</span>
              <span className="ml-1 text-xs">sur la période</span>
            </div>
          </div>
          <CardDescription className="text-sm">
            Évolution sur {selectedPeriod} {selectedPeriod === '1' ? 'mois' : 'derniers mois'}
          </CardDescription>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
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
            <AreaChart
              accessibilityLayer
              data={sortedData}
              margin={{
                left: 12,
                right: 12,
                top: 5,
                bottom: 0,
              }}
            >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.split(' ')[0]}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="value"
              type="natural"
              fill="var(--color-expenses)"
              fillOpacity={0.4}
              stroke="var(--color-expenses)"
              style={{
                '--color-expenses': '#5b50ff',
              } as React.CSSProperties}
              name="Dépenses"
            />
          </AreaChart>
        </ChartContainer>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              {trend.percentage > 0 ? 'Hausse' : 'Baisse'} de {trend.percentage}% ce mois-ci{' '}
              <TrendingUp className={`h-4 w-4 ${trend.isPositive ? 'text-green-500' : 'text-red-500 rotate-180'}`} />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              {sortedData[0]?.name} - {sortedData[sortedData.length - 1]?.name} {currentYear}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}