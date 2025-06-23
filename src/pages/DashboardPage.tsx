import { ExpensesChart, RevenueChart, RevenueExpensesChart } from "@/features/dashboard/components";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Bienvenue sur votre espace de travail
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-full">
          <ExpensesChart />
        </div>
        <div className="h-full">
          <RevenueChart />
        </div>
      </div>
      <div>
          <h2 className="text-lg font-semibold mb-4">Synthèse mensuelle</h2>
          <RevenueExpensesChart />
        </div>
    </div>
  );
}