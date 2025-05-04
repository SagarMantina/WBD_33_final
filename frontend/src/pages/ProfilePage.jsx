import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBill, faUser, faGamepad, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import UserDashboard from '../components/userpage/UserDashboard';
import './ProfilePage.css'
import Header from './Header'
import Footer from './Footer';
import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const ProfilePage = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [usernav,setUserNav] = useState("AccountDetails");
  const {clearCart} = useCartStore();

  const handleLogout = async () => {
    try {
      
      const response = await fetch(`${backendUrl}/signout`, {
        method: 'GET',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json',
          'x-username': localStorage.getItem('username'), // send from localStorage
        },
      }); 

      if(response.ok) {
        localStorage.removeItem('username'); // Remove username from local storage
     
         if(localStorage.getItem('username') === null) {
          clearCart(); // Clear the cart on logout
          navigate('/login'); // Redirect to login page 
         }
      }
     
    } catch (error) {
      console.error("Error during logout:", error);
      alert('Error processing logout.');
    }
  };

  return (
    <>
    <Header />
    <div className='userprofilepage' style={{minHeight:'100vh'}}>
      <div className='usersidebar'>
      <ul>
          <li onClick={() => setUserNav("AccountDetails")}><FontAwesomeIcon icon={faUser} />Account Details</li>
          <li onClick={() => setUserNav("MyGames")}><FontAwesomeIcon icon={faGamepad} />My Games</li>
          <li onClick={() => setUserNav("Transactions")}><FontAwesomeIcon icon={faMoneyBill} />Transactions</li>
          <li onClick={handleLogout}><FontAwesomeIcon icon={faSignOutAlt} /> Log Out</li>
        </ul>
      </div>

      <UserDashboard usernav={usernav} />
    </div>
    <Footer />
    </>
  )
}

export default ProfilePage