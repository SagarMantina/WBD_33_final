import React, { useEffect, useState } from 'react';
import '../../styles/Transcation.css';

const UserTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('http://localhost:3000/user/transactions', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // If you're using authentication cookies
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json(); // Parse the JSON response

        if (Array.isArray(data)) {
          setTransactions(data); // Only set if data is an array
        } else {
          setError('Invalid response format');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch transactions'); // Set error message
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <p>Loading transactions...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="transaction-page">
      <h1>Recent Transactions</h1>
      <div className="transaction-container">
        <table className="transaction-table">
          <thead>
            <tr>
          
              <th>Buyer</th>
              <th>Seller</th>
              <th>Amount (₹)</th>
              <th>Game Name</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr key={transaction._id}>
                  
                  <td className="highlight">{transaction.buyer}</td>
                  <td className="highlight">{transaction.seller}</td>
                  <td className="highlight">{transaction.amount.toFixed(2)}</td>
                  <td className="highlight">{transaction.game_name}</td>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
        
      </div>
    </div>
  );
};

export default UserTransactions;
