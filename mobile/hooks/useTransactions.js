import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

const API_URL = 'https://wallet-api-iucj.onrender.com/api';

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/${userId}`);

      //
      if (response.status === 204) {
        console.log('No transactions, 204 from API');
        setTransactions([]);
        return;
      }

      const text = await response.text();
      console.log('RAW TRANSACTIONS RESPONSE:', text);

      if (!text) {
        //
        setTransactions([]);
        return;
      }

      const data = JSON.parse(text);
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/summary/${userId}`);

      if (response.status === 204) {
        console.log('No summary, 204 from API');
        setSummary({ balance: 0, income: 0, expenses: 0 });
        return;
      }

      const text = await response.text();
      console.log('RAW SUMMARY RESPONSE:', text);

      if (!text) {
        setSummary({ balance: 0, income: 0, expenses: 0 });
        return;
      }

      const data = JSON.parse(text);
      setSummary(data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete transaction');

      await loadData();
      Alert.alert('Success', 'Transaction deleted successfully');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      Alert.alert('Error', error.message);
    }
  };

  return { transactions, summary, isLoading, loadData, deleteTransaction };
};
