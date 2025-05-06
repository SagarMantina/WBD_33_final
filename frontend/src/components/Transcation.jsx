import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import '../styles/Transcation.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalAmount: 0,
    averageAmount: 0,
    uniqueCustomers: 0,
    revenue: 0,
  });
  const [topRevenueSellers, setTopRevenueSellers] = useState([]);
  const [topOldestSellers, setTopOldestSellers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const username = localStorage.getItem('username');

        // Fetch transactions
        const transactionRes = await fetch(`${backendUrl}/admin/transactions`, {
          headers: {
            'Content-Type': 'application/json',
            'x-username': username,
          },
          credentials: 'include',
        });

        if (!transactionRes.ok) throw new Error('Failed to fetch transactions');

        const transactionData = await transactionRes.json();
        if (!Array.isArray(transactionData)) throw new Error('Invalid transaction format');

        setTransactions(transactionData);
        calculateStats(transactionData);

        // Fetch revenue data
        const revenueRes = await fetch(`${backendUrl}/admin/revenue`, {
          headers: {
            'Content-Type': 'application/json',
            'x-username': username,
          },
          credentials: 'include',
        });
        
        if (!revenueRes.ok) throw new Error('Failed to fetch revenue details');

        const revenueData = await revenueRes.json();
        setStats(prev => ({ ...prev, revenue: revenueData.revenue.toFixed(2) }));
        setTopRevenueSellers(revenueData.topRevenueSellers || []);
        setTopOldestSellers(revenueData.topSellers || []);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateStats = (data) => {
    const totalAmount = data.reduce((sum, t) => sum + t.amount, 0);
    const uniqueCustomers = new Set(data.map(t => t.buyer)).size;

    setStats(prev => ({
      ...prev,
      totalTransactions: data.length,
      totalAmount: totalAmount.toFixed(2),
      averageAmount: (totalAmount / data.length).toFixed(2),
      uniqueCustomers,
    }));
  };

  const prepareChartData = (key) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString();
    }).reverse();
  
    const dailyValues = last7Days.map(date => {
      const dayTransactions = transactions.filter(t =>
        new Date(t.date).toLocaleDateString() === date
      );
      const total = dayTransactions.reduce((sum, t) => sum + t.amount, 0);
      return key === 'amount' ? total : total * 0.1;
    });
  
    return {
      labels: last7Days,
      datasets: [
        {
          label: key === 'amount' ? 'Daily Transaction Amount' : 'Revenue (10% of Transactions)',
          data: dailyValues,
          borderColor: key === 'amount' ? '#4a90e2' : '#ff9900',
          backgroundColor: key === 'amount' ? 'rgba(74, 144, 226, 0.1)' : 'rgba(255, 153, 0, 0.1)',
          tension: 0.4,
          fill: true,
        }
      ]
    };
  };
  
  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="transaction-page">
      <h1>Transaction Dashboard</h1>

      <div className="stats-container">
        <div className="stat-card"><h3>Total Transactions</h3><p>{stats.totalTransactions}</p></div>
        <div className="stat-card"><h3>Total Amount</h3><p>₹{stats.totalAmount}</p></div>
        <div className="stat-card"><h3>Average Transaction</h3><p>₹{stats.averageAmount}</p></div>
        <div className="stat-card"><h3>Unique Customers</h3><p>{stats.uniqueCustomers}</p></div>
        <div className="stat-card"><h3>Total Revenue</h3><p>₹{stats.revenue}</p></div>
      </div>

      <div className="transaction-container">
        <div>
          <div className="graph-container">
            <h2>Transaction Trends</h2>
            <Line data={prepareChartData('amount')} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Last 7 Days Transaction Amount' } }, scales: { y: { beginAtZero: true }, x: { grid: { display: false } } } }} />

            <h2 style={{ marginTop: '30px' }}>Revenue Trends</h2>
            <Line data={prepareChartData('revenue')} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Revenue Over Last 7 Days (Approximation)' } }, scales: { y: { beginAtZero: true }, x: { grid: { display: false } } } }} />
          </div>

          <table className="transaction-table">
            <thead>
              <tr>
                <th>Buyer</th>
                <th>Seller</th>
                <th>Amount (₹)</th>
                <th>Game Name</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td className="highlight">{transaction.buyer}</td>
                    <td className="highlight">{transaction.seller}</td>
                    <td className="highlight">₹{transaction.amount.toFixed(2)}</td>
                    <td className="highlight">{transaction.game_name}</td>
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    <td><span className="status-badge completed">Completed</span></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6">No transactions found.</td></tr>
              )}
            </tbody>
          </table>

          <h2>Top 5 Sellers by Revenue</h2>
          <table className="transaction-table">
            <thead>
              <tr><th>Username</th><th>Earnings (₹)</th></tr>
            </thead>
            <tbody>
              {topRevenueSellers.map((seller, index) => (
                <tr key={index}>
                  <td className="highlight">{seller.username}</td>
                  <td className="highlight">₹{seller.earnings.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Top 5 Oldest Sellers</h2>
          <table className="transaction-table">
            <thead>
              <tr><th>Username</th><th>Joined At</th></tr>
            </thead>
            <tbody>
              {topOldestSellers.map((seller, index) => (
                <tr key={index}>
                  <td className="highlight">{seller.username}</td>
                  <td className="highlight">{new Date(seller.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="recent-customers">
          <h2>Recent Customers</h2>
          <ul>
            {[...new Set(transactions.map(transaction => transaction.buyer))].slice(0, 5).map((buyer, index) => (
              <li key={index}>
                <span className="customer-name">{buyer}</span>
                <span className="transaction-count">
                  {transactions.filter(t => t.buyer === buyer).length} transactions
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
