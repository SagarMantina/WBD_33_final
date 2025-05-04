
import React from 'react';
import '../styles/Sidebar.css';
import Dashboard from '../components/Dashboard';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUser, faMoneyCheck, faGamepad, faUsers, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Header from './Header'
import Footer from './Footer';



const AdminPage = () => {
  const [nav, setNav] = useState("Dashboard");
  
  const handleLogout = async () => {
    try {
      const username = localStorage.getItem('username');
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/signout`, {
        method: 'GET',
        credentials: 'include', 
         headers: {
      'Content-Type': 'application/json',
      'x-username': localStorage.getItem('username') // send from localStorage
       }, 
      });

      if(response.ok) {
        localStorage.removeItem('username'); // Remove username from local storage
     
        window.location.href = ('/login');
      }
     
    } catch (error) {
      console.error("Error during logout:", error);
      alert('Error processing logout.');
    }
  };

  return (
   <>
   <Header />
   <div className='admin-page'  style={{minHeight:'100vh'}}>
      <div className="sidebar" style={{position:'fixed'}}>
        <ul>
          <li onClick={() => setNav("Dashboard")}><FontAwesomeIcon icon={faTachometerAlt} /> Dashboard</li>
          <li onClick={() => setNav("Profile")}><FontAwesomeIcon icon={faUser} /> Profile</li>
          <li onClick={() => setNav("Transcation")}><FontAwesomeIcon icon={faMoneyCheck} /> Transactions</li>
          <li onClick={() => setNav("Games")}><FontAwesomeIcon icon={faGamepad} /> Games</li>
          <li onClick={() => setNav("Users")}><FontAwesomeIcon icon={faUsers} /> Users</li>
          <li onClick={() => setNav("Publish")}><FontAwesomeIcon icon={faUsers} /> Publish</li>
          <li onClick={() => setNav("Community")}><FontAwesomeIcon icon={faUsers} /> Community</li>
          <li onClick={handleLogout}><FontAwesomeIcon icon={faSignOutAlt} /> Log Out</li>
        </ul>
      </div>
      <Dashboard nav={nav} />
    </div>
    <Footer />
   </>
  );
}

export default AdminPage;
