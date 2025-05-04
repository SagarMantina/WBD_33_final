// import React, { useEffect, useState } from 'react';
// import '../../styles/sellerstyles/SellerTransactions.css';
// import SalesInfo from '../SalesInfo';

// const SellerSalesInfo = () => {
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchTransactions = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/seller/transactions', {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           credentials: 'include', // If you're using authentication cookies
//         });

//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }

//         const data = await response.json(); // Parse the JSON response

//         if (Array.isArray(data)) {
//           setTransactions(data); // Only set if data is an array
//         } else {
//           setError('Invalid response format');
//         }
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to fetch transactions'); // Set error message
//         setLoading(false);
//       }
//     };

//     fetchTransactions();
//   }, []);

//   if (loading) {
//     return <p>Loading transactions...</p>;
//   }

//   if (error) {
//     return <p>{error}</p>;
//   }

//   return (
//     <div className="seller-transaction-page">
//       <h1>Recent Transactions</h1>
//       <div className="seller-transaction-container">
//         <table className="seller-transaction-table">
//           <thead>
//             <tr>
//               <th>Buyer</th>
//               <th>Seller</th>
//               <th>Amount ($)</th>
//               <th>Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {transactions.length > 0 ? (
//               transactions.map((transaction) => (
//                 <tr key={transaction._id}>
//                   <td className="seller-highlight">{transaction.buyer}</td>
//                   <td className="seller-highlight">{transaction.seller}</td>
//                   <td className="seller-highlight">{transaction.amount.toFixed(2)}</td>
//                   <td>{new Date(transaction.date).toLocaleDateString()}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="4">No transactions found.</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//         <div className="seller-recent-customers">
//           <h2>Recent Customers</h2>
//           <ul>
//             {transactions.slice(0, 5).map((transaction, index) => (
//               <li key={index}>{transaction.buyer}</li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SellerSalesInfo;
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
import '../../styles/sellerstyles/SellerTransactions.css'

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
    uniqueCustomers: 0
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${backendUrl}/seller/transactions`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-username': localStorage.getItem('username'), // Include username in headers
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setTransactions(data);
          calculateStats(data);
        } else {
          setError('Invalid response format');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch transactions');
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const calculateStats = (data) => {
    const totalAmount = data.reduce((sum, t) => sum + t.amount, 0);
    const uniqueCustomers = new Set(data.map(t => t.buyer)).size;
    
    setStats({
      totalTransactions: data.length,
      totalAmount: totalAmount.toFixed(2),
      averageAmount: (totalAmount / data.length).toFixed(2),
      uniqueCustomers
    });
  };

  const prepareChartData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString();
    }).reverse();

    const dailyAmounts = last7Days.map(date => {
      const dayTransactions = transactions.filter(t => 
        new Date(t.date).toLocaleDateString() === date
      );
      return dayTransactions.reduce((sum, t) => sum + t.amount, 0);
    });

    return {
      labels: last7Days,
      datasets: [
        {
          label: 'Daily Transaction Amount',
          data: dailyAmounts,
          borderColor: '#4a90e2',
          backgroundColor: 'rgba(74, 144, 226, 0.1)',
          tension: 0.4,
          fill: true
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
        <div className="stat-card">
          <h3>Total Transactions</h3>
          <p>{stats.totalTransactions}</p>
        </div>
        <div className="stat-card">
          <h3>Total Amount</h3>
          <p>₹{stats.totalAmount}</p>
        </div>
        <div className="stat-card">
          <h3>Average Transaction</h3>
          <p>₹{stats.averageAmount}</p>
        </div>
        <div className="stat-card">
          <h3>Unique Customers</h3>
          <p>{stats.uniqueCustomers}</p>
        </div>
      </div>

      <div className="transaction-container">
        <div>
          <div className="graph-container">
            <h2>Transaction Trends</h2>
            <Line 
              data={prepareChartData()} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Last 7 Days Transaction Amount'
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(0, 0, 0, 0.05)'
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                }
              }}
            />
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
                    <td>
                      <span className="status-badge completed">Completed</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="recent-customers">
          <h2>Customers</h2>
          <ul>
           {console.log("transactions:" + transactions)}
            {[...new Set(transactions.map(transaction => transaction.buyer))]
              .slice(0, 5)
              .map((buyer, index) => (
                <li key={index}>
                {console.log(buyer)}
                
                  <span className="customer-name">{buyer}</span>
                  <span className="transaction-count">
                    {  -  transactions.filter(t => t.buyer === buyer).length} transactions
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
