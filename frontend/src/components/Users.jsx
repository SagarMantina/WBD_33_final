import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import '../styles/Users.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faEye, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Users = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalVisits, setTotalVisits] = useState(0);
  const [dailyVisits, setDailyVisits] = useState([]);
  const [allUsers,setAllUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "" });
  const [updateData, setUpdateData] = useState({ username: "", newPassword: "" });

 
  useEffect(() => {
    fetch("http://localhost:3000/admin/all_users", {
      credentials: "include", 
    })
      .then((response) => response.json())
      .then((data) => {
        setAllUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  const [deleteUsername, setDeleteUsername] = useState("");

  const handleDeleteUser = async () => {
    try {
      const response = await fetch("http://localhost:3000/admin/delete_user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: deleteUsername }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("User deleted successfully!");
        setDeleteUsername("");
      } else {
        console.log(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
 
  const handleCreateUser = async () => {
    try {
      const response = await fetch("http://localhost:3000/admin/create_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        toast.success("User created successfully!");
        setNewUser({ username: "", email: "", password: "" });
      }

      else{
        toast.error("User creation failed! Please try again.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  
  const handleUpdateUser = async () => {
    try {
      const response = await fetch("http://localhost:3000/admin/update_user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify(updateData),
      });
      if (response.ok) {
        toast.success("Password updated successfully!");
        setUpdateData({ username: "", newPassword: "" });
      }

      else{
        toast.error("Password update failed! Please try again.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/allusers", {
          credentials: "include", 
        });
        const data = await response.json();
        setTotalUsers(data.total_users);
        setTotalVisits(data.total_visits);
        setDailyVisits(data.weekly_visits);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
  
    fetchData();
  }, []);
  
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Daily Visits',
        data: dailyVisits,
        fill: false,
        backgroundColor: '#4299e1',
        borderColor: '#4299e1',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Daily Visits',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
      </div>
      <div className="dashboard-metrics" style={{display:'flex'}}>
        <div className="metric-card">
          <FontAwesomeIcon icon={faUsers} className="metric-icon" />
          <p>{totalUsers}</p>
          <h2>Total Users</h2>
        </div>
        <div className="metric-card">
          <FontAwesomeIcon icon={faEye} className="metric-icon" />
          <p>{totalVisits}</p>
          <h2>Total Visits</h2>
        </div>
        <div className="metric-card">
          <FontAwesomeIcon icon={faChartBar} className="metric-icon" />
          <p>{dailyVisits.reduce((acc, val) => acc + val, 0)}</p>
          <h2>Weekly Visits</h2>
        </div>
      </div>
      <div className="chart-container">
        <Line data={data} options={options} />
      </div>



      <div style={{ padding: "20px" }}>
      <h1>All Users</h1>
      <table style={{ border: "1px solid black", width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "8px" }}>Username</th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map((user, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid black", padding: "8px" }}>{user.username}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Create New User</h2>
<input
  required
  type="text"
  placeholder="Username"
  value={newUser.username}
  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}  
  style={{ marginRight: "10px" }}
/>
<input
  required
  type="email"
  placeholder="Email"
  value={newUser.email}
  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}  
  style={{ marginRight: "10px" }}
/>
<input
  required
  type="password"
  placeholder="Password"
  value={newUser.password}
  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}  
  style={{ marginRight: "10px" }}
/>
<button 
  type="button" 
  onClick={handleCreateUser} 
  disabled={!newUser.username || !newUser.email || !newUser.password} // Button disabled when fields are empty
>
  Create
</button>

<h2>Update User Password</h2>
<input
  required
  type="text"
  placeholder="Username"
  value={updateData.username}
  onChange={(e) => setUpdateData({ ...updateData, username: e.target.value })}  
  style={{ marginRight: "10px" }}
/>
<input
  required
  type="password"
  placeholder="New Password"
  value={updateData.newPassword}
  onChange={(e) => setUpdateData({ ...updateData, newPassword: e.target.value })}  
  style={{ marginRight: "10px" }}
/>
<button 
  type="button" 
  onClick={handleUpdateUser} 
  disabled={!updateData.username || !updateData.newPassword} // Button disabled when fields are empty
>
  Update
</button>
  <h2>Delete User</h2>
        <input
          required
          type="text"
          placeholder="Username"
          value={deleteUsername}
          onChange={(e) => setDeleteUsername(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button 
          type="button" 
          onClick={handleDeleteUser} 
          disabled={!deleteUsername} 
        >
          Delete
        </button>
  <ToastContainer />
    </div>
    </div>
  );
};

export default Users;
