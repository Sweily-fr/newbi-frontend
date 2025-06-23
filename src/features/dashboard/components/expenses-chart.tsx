"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useExpenses } from "../hooks/use-expenses"
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
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ExpensesChart() {
  const { data: expenses, loading, error } = useExpenses()
  
  // Log des données reçues pour le débogage
  console.log('Données reçues dans ExpensesChart:', {
    loading,
    error,
    expenses: expenses ? JSON.parse(JSON.stringify(expenses)) : null,
    'type de expenses': expenses ? typeof expenses : 'null',
    'est un tableau': Array.isArray(expenses),
    'longueur': Array.isArray(expenses) ? expenses.length : 'N/A'
  });

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

  // Formater les données pour le graphique
  const chartData = expenses.map(expense => ({
    name: expense.name || 'Mois inconnu',
    value: expense.total || 0,
    count: expense.count || 0,
    // Ajouter des champs supplémentaires pour le tooltip si nécessaire
    total: expense.total || 0,
    month: expense.name || 'Mois inconnu'
  }));

  console.log('=== DONNÉES POUR LE GRAPHIQUE ===');
  console.log('Nombre d\'entrées:', chartData.length);
  console.log('Première entrée:', chartData[0]);
  console.log('Toutes les données:', JSON.stringify(chartData, null, 2));
  console.log('=== FIN DES DONNÉES POUR LE GRAPHIQUE ===');

  // Si pas de données, afficher un message
  if (chartData.length === 0 || chartData.every(item => item.value === 0)) {
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
  // On utilise le tri existant du hook useExpenses qui gère correctement les dates
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
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Dépenses mensuelles</CardTitle>
        <CardDescription className="text-sm">
          Évolution sur les 12 derniers mois
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <div className="h-[300px] w-full">
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={sortedData}
            margin={{
              left: 12,
              right: 12,
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