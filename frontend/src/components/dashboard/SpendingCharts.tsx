import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, BarChart, Bar } from "recharts";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  date: string;
  categories?: {
    name: string;
    color: string;
    icon: string;
  };
}

interface SpendingChartsProps {
  transactions: Transaction[];
}

const SpendingCharts = ({ transactions }: SpendingChartsProps) => {
  // Prepare data for pie chart (expenses by category)
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const categoryName = transaction.categories?.name || 'Other';
      const existing = acc.find(item => item.name === categoryName);
      if (existing) {
        existing.value += Number(transaction.amount);
      } else {
        acc.push({
          name: categoryName,
          value: Number(transaction.amount),
          color: transaction.categories?.color || '#8884d8'
        });
      }
      return acc;
    }, [] as Array<{ name: string; value: number; color: string }>);

  // Prepare data for line chart (spending over time)
  const spendingOverTime = transactions
    .reduce((acc, transaction) => {
      const date = new Date(transaction.date).toLocaleDateString();
      const existing = acc.find(item => item.date === date);
      
      if (existing) {
        if (transaction.type === 'income') {
          existing.income += Number(transaction.amount);
        } else {
          existing.expenses += Number(transaction.amount);
        }
      } else {
        acc.push({
          date,
          income: transaction.type === 'income' ? Number(transaction.amount) : 0,
          expenses: transaction.type === 'expense' ? Number(transaction.amount) : 0,
        });
      }
      return acc;
    }, [] as Array<{ date: string; income: number; expenses: number }>)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7); // Last 7 days

  // Chart configuration
  const chartConfig = {
    expenses: {
      label: "Expenses",
      color: "hsl(var(--expense))",
    },
    income: {
      label: "Income", 
      color: "hsl(var(--income))",
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Pie Chart - Expenses by Category */}
      <Card className="bg-gradient-to-br from-card to-card/80 border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
          <CardDescription>Breakdown of your spending categories</CardDescription>
        </CardHeader>
        <CardContent>
          {expensesByCategory.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value) => [`$${Number(value).toFixed(2)}`, "Amount"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <p>No expense data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Line Chart - Income vs Expenses Over Time */}
      <Card className="bg-gradient-to-br from-card to-card/80 border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Income vs Expenses</CardTitle>
          <CardDescription>Your financial trend over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          {spendingOverTime.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={spendingOverTime}>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value, name) => [`$${Number(value).toFixed(2)}`, name === 'income' ? 'Income' : 'Expenses']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    stroke="hsl(var(--income))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--income))", strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="hsl(var(--expense))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--expense))", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <p>No transaction data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SpendingCharts;