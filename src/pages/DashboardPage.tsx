import { ExpensesChart } from "@/features/dashboard/components";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Bienvenue sur votre espace de travail
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <ExpensesChart />
        </div>
        <div className="w-full md:w-1/2 bg-muted/50 rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">Autre contenu ici</p>
        </div>
      </div>
    </div>
  );
}