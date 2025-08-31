import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAITransactionParser } from '@/hooks/useAITransactionParser';
import { ModeToggle } from '@/components/ui/mode-toggle';
import SpendingCharts from '@/components/dashboard/SpendingCharts';
import TransactionList from '@/components/dashboard/TransactionList';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  LogOut,
  Send,
  Loader2,
  BarChart3
} from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  date: string;
  category_id: string;
  ai_parsed: boolean;
  ai_confidence: number;
  categories?: {
    name: string;
    color: string;
    icon: string;
  };
}

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [parsedTransaction, setParsedTransaction] = useState<any>(null);
  const [confirming, setConfirming] = useState(false);
  const { parseTransaction, loading } = useAITransactionParser(categories);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Fetch data
  useEffect(() => {
    if (user) {
      fetchTransactions();
      fetchCategories();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          categories (
            name,
            color,
            icon
          )
        `)
        .eq('user_id', user?.id)
        .order('date', { ascending: false })
        .limit(50);

      if (error) throw error;
      setTransactions((data || []) as Transaction[]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    }
  };

  const handleParseTransaction = async () => {
    if (!aiInput.trim()) return;
    
    try {
      const result = await parseTransaction(aiInput);
      if (result) {
        setParsedTransaction(result);
      } else {
        toast({
          title: "Error",
          description: "Failed to parse transaction",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to parse transaction",
        variant: "destructive",
      });
    }
  };

  const confirmTransaction = async () => {
    if (!parsedTransaction) return;
    
    setConfirming(true);
    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user?.id,
          amount: parsedTransaction.amount,
          description: parsedTransaction.description,
          type: parsedTransaction.type,
          category_id: parsedTransaction.category_id,
          date: parsedTransaction.date || new Date().toISOString().split('T')[0],
          ai_parsed: true,
          ai_confidence: parsedTransaction.ai_confidence,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transaction added successfully!",
      });

      setAiInput('');
      setParsedTransaction(null);
      fetchTransactions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save transaction",
        variant: "destructive",
      });
    } finally {
      setConfirming(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  
  const savings = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">FinanceAI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Welcome, {user.email}
            </span>
            <ModeToggle />
            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-card to-card/80 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Income
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-income" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-income">
                ${totalIncome.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Expenses
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-expense" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-expense">
                ${totalExpenses.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Net Savings
              </CardTitle>
              <PiggyBank className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${savings >= 0 ? 'text-income' : 'text-expense'}`}>
                ${Math.abs(savings).toFixed(2)}
              </div>
              <p className={`text-xs ${savings >= 0 ? 'text-income' : 'text-expense'}`}>
                {savings >= 0 ? 'Saving money' : 'Spending more than earning'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Spending Charts */}
        <SpendingCharts transactions={transactions} />

        {/* AI Transaction Input */}
        <Card className="mb-8 bg-gradient-to-br from-card to-card/80 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Smart Transaction Entry</span>
              <Badge variant="secondary" className="text-xs">AI Powered</Badge>
            </CardTitle>
            <CardDescription>
              Try: "Coffee at Starbucks $6.50", "Netflix subscription $15.99", or "Got paid $3500 salary"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                placeholder="e.g., 'Coffee at Starbucks $6.50' or 'Amazon purchase $89.99'"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleParseTransaction()}
                className="flex-1"
              />
              <Button 
                onClick={handleParseTransaction} 
                disabled={loading || !aiInput.trim()}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>

            {/* Parsed Transaction Preview */}
            {parsedTransaction && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
                <h4 className="font-semibold mb-2">Parsed Transaction:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Amount:</span>
                    <span className={`ml-2 font-semibold ${parsedTransaction.type === 'income' ? 'text-income' : 'text-expense'}`}>
                      ${parsedTransaction.amount}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <span className="ml-2 font-semibold capitalize">{parsedTransaction.type}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <span className="ml-2">{parsedTransaction.category?.icon} {parsedTransaction.category?.name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Confidence:</span>
                    <span className="ml-2">{Math.round(parsedTransaction.ai_confidence * 100)}%</span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-muted-foreground">Description:</span>
                  <span className="ml-2">{parsedTransaction.description}</span>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button onClick={confirmTransaction} disabled={confirming} size="sm">
                    {confirming ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Confirm & Save
                  </Button>
                  <Button onClick={() => setParsedTransaction(null)} variant="outline" size="sm">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transaction Management */}
        <TransactionList transactions={transactions} onRefresh={fetchTransactions} />
      </div>
    </div>
  );
};

export default Dashboard;