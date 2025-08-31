import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Calendar, 
  Filter, 
  Edit3, 
  Trash2, 
  DollarSign,
  Search
} from 'lucide-react';

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
  ai_parsed?: boolean;
}

interface TransactionListProps {
  transactions: Transaction[];
  onRefresh: () => void;
}

const TransactionList = ({ transactions, onRefresh }: TransactionListProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.categories?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || transaction.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setEditAmount(transaction.amount.toString());
    setEditDescription(transaction.description);
  };

  const handleSaveEdit = async () => {
    if (!editingTransaction) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          amount: parseFloat(editAmount),
          description: editDescription,
        })
        .eq('id', editingTransaction.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transaction updated successfully!",
      });

      setEditingTransaction(null);
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update transaction",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (transactionId: string) => {
    setIsDeleting(transactionId);
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transaction deleted successfully!",
      });

      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-card to-card/80 border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Manage your financial activities</CardDescription>
          </div>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("all")}
            >
              All
            </Button>
            <Button
              variant={filterType === "income" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("income")}
              className={filterType === "income" ? "bg-income hover:bg-income/90" : ""}
            >
              Income
            </Button>
            <Button
              variant={filterType === "expense" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("expense")}
              className={filterType === "expense" ? "bg-expense hover:bg-expense/90" : ""}
            >
              Expenses
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{searchTerm || filterType !== "all" ? "No transactions match your search" : "No transactions yet"}</p>
              <p className="text-sm">
                {searchTerm || filterType !== "all" ? "Try adjusting your filters" : "Add your first transaction using the AI input above"}
              </p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors group">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {transaction.categories?.icon || '📄'}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{transaction.categories?.name}</span>
                      {transaction.ai_parsed && (
                        <Badge variant="secondary" className="text-xs">AI</Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className={`font-semibold ${transaction.type === 'income' ? 'text-income' : 'text-expense'}`}>
                      {transaction.type === 'income' ? '+' : '-'}${Number(transaction.amount).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {/* Action buttons - shown on hover */}
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(transaction)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Transaction</DialogTitle>
                          <DialogDescription>
                            Make changes to your transaction details.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <label htmlFor="amount">Amount</label>
                            <Input
                              id="amount"
                              type="number"
                              value={editAmount}
                              onChange={(e) => setEditAmount(e.target.value)}
                              placeholder="0.00"
                            />
                          </div>
                          <div className="grid gap-2">
                            <label htmlFor="description">Description</label>
                            <Input
                              id="description"
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              placeholder="Transaction description"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditingTransaction(null)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSaveEdit}>
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(transaction.id)}
                      disabled={isDeleting === transaction.id}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionList;