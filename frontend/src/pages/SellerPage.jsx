import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUser, faGamepad, faUsers, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/SellerPage.css';
import SellerDashboard from '../components/sellerpage/SellerDashboard';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Header from './Header';
import Footer from './Footer'
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const SellerPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [sellnav, setSellNav] = useState("Dashboard");
  

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
        if(response.ok) {
          localStorage.removeItem('username'); // Remove username from local storage
       
           if(localStorage.getItem('username') === null) {
           
            navigate('/login'); // Redirect to login page 
           }
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
    <div className='sellerpage'>
      <div className="sellsidebar">
        <ul>
          <li onClick={() => setSellNav("Dashboard")}><FontAwesomeIcon icon={faTachometerAlt} /> Dashboard</li>
          <li onClick={() => setSellNav("AccountDetails")}><FontAwesomeIcon icon={faUser} /> Account Details</li>
          <li onClick={() => setSellNav("MyGames")}><FontAwesomeIcon icon={faGamepad} /> My Games</li>
          <li onClick={() => setSellNav("Sell")}><FontAwesomeIcon icon={faUsers} /> Sell</li>
          <li onClick={() => setSellNav("ManageGames")}><FontAwesomeIcon icon={faUsers} /> Manage Games</li>
          <li onClick={handleLogout}><FontAwesomeIcon icon={faSignOutAlt} /> Log Out</li> {/* Call handleLogout on logout */}
        </ul>
      </div>

      <SellerDashboard sellnav={sellnav} />
    </div>
    <Footer />
  </>
  );
}

export default SellerPage;
