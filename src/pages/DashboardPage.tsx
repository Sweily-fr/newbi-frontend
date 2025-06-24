import {
  ExpensesChart,
  RevenueChart,
  RevenueExpensesChart,
} from "@/features/dashboard/components";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-8 px-6 sm:px-8 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-full">
          <RevenueChart />
        </div>
        <div className="h-full">
          <ExpensesChart />
        </div>
      </div>
      <div>
        <RevenueExpensesChart />
      </div>
    </div>
  );
}
