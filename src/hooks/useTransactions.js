import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useTransactions(month, year) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().slice(0, 10);

    const { data, error: err } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (err) setError(err.message);
    else setTransactions(data || []);
    setLoading(false);
  }, [user, month, year]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = useCallback(async (txData, addToast) => {
    const optimisticId = `optimistic-${Date.now()}`;
    const optimistic = { ...txData, id: optimisticId, user_id: user.id, created_at: new Date().toISOString() };
    setTransactions((prev) => [optimistic, ...prev]);

    const { data, error: err } = await supabase
      .from('transactions')
      .insert({ ...txData, user_id: user.id })
      .select()
      .single();

    if (err) {
      setTransactions((prev) => prev.filter((t) => t.id !== optimisticId));
      addToast?.('Failed to save transaction. Please try again.', 'error');
    } else {
      setTransactions((prev) => prev.map((t) => (t.id === optimisticId ? data : t)));
    }
    return { error: err };
  }, [user]);

  const updateTransaction = useCallback(async (id, updates, addToast) => {
    const prev = transactions.find((t) => t.id === id);
    setTransactions((all) => all.map((t) => (t.id === id ? { ...t, ...updates } : t)));

    const { data, error: err } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (err) {
      setTransactions((all) => all.map((t) => (t.id === id ? prev : t)));
      addToast?.('Failed to update transaction.', 'error');
    } else {
      setTransactions((all) => all.map((t) => (t.id === id ? data : t)));
    }
    return { error: err };
  }, [transactions]);

  const deleteTransaction = useCallback(async (id, addToast) => {
    const backup = transactions.find((t) => t.id === id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));

    const { error: err } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (err) {
      setTransactions((prev) => [backup, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)));
      addToast?.('Failed to delete transaction.', 'error');
    }
    return { error: err };
  }, [transactions]);

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  return {
    transactions,
    loading,
    error,
    totalIncome,
    totalExpense,
    balance,
    savingsRate,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions,
  };
}
