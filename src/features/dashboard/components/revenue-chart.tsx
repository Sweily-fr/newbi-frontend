"use client"

import React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"
import { useRevenue } from "../hooks/use-revenue"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
// Options pour le filtre de période
const PERIOD_OPTIONS = [
  { value: '12', label: '12 derniers mois' },
  { value: '6', label: '6 derniers mois' },
  { value: '3', label: '3 derniers mois' },
  { value: '1', label: '30 derniers jours' },
] as const;

// Configuration pour le graphique
const CHART_COLORS = {
  revenue: "hsl(var(--primary))", // Couleur primaire de shadcn
}

// Composant personnalisé pour le tooltip
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      name: string;
      total: number;
      count: number;
    };
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border rounded-lg p-4 shadow-lg">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">
          {data.count} facture{data.count > 1 ? 's' : ''}
        </p>
        <p className="font-semibold mt-1">
          {data.total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
        </p>
      </div>
    );
  }
  return null;
};

export function RevenueChart() {
  const [selectedPeriod, setSelectedPeriod] = React.useState<string>('12');
  const { 
    data: revenueData, 
    loading, 
    error, 
    totalRevenue, 
    totalInvoices,
    refreshData
  } = useRevenue({ months: selectedPeriod as '1' | '3' | '6' | '12' })
  
  // Formatage du chiffre d'affaires total
  const formattedTotalRevenue = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(totalRevenue || 0);
  
  // Recharger les données lorsque la période change
  React.useEffect(() => {
    refreshData();
  }, [selectedPeriod, refreshData]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
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
          <p className="text-destructive">
            Impossible de charger les données du chiffre d'affaires: {error.message}
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
    )
  }

  if (!revenueData || revenueData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chiffre d'affaires mensuel</CardTitle>
          <CardDescription>
            Aucune donnée de facturation disponible pour les 12 derniers mois
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground text-center">
            Aucune facture complétée trouvée pour la période sélectionnée.
          </p>
          <p className="text-sm text-muted-foreground text-center">
            Le graphique s'affichera automatiquement lors de l'ajout de factures avec le statut "Complété".
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-base font-semibold">
            Chiffre d'affaires
          </CardTitle>
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
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={revenueData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.revenue} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={CHART_COLORS.revenue} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
              <RechartsTooltip 
                content={<CustomTooltip />}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                }}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke={CHART_COLORS.revenue}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              {formattedTotalRevenue} sur {totalInvoices} facture{totalInvoices > 1 ? 's' : ''}
            </div>
            <div className="text-xs text-muted-foreground">
              Données des {selectedPeriod} {selectedPeriod === '1' ? 'mois' : 'derniers mois'}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
