import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
// import AdminPage from './pages/AdminPage';
// import ProfilePage from './pages/ProfilePage';

// import SellerPage from './pages/SellerPage';
import TestPage from './pages/testPage';
import ResultPage from './pages/ResultPage';
import GamePage from './pages/GamePage';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import PurchasePage from './pages/PurchasePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Register2 from './pages/Register2';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/ChatPage';

import Communities from './pages/Communities';

import CommunityChat from './pages/CommunityChat';
import About from './pages/About';
import Unauthorized from './pages/ErrorPage';

import { useCartStore } from './store/cartStore';
import { useEffect } from 'react';
// import ProfilePage from './pages/ProfilePage';
function App() {
  const setCart = useCartStore((state) => state.setCart);
   

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('http://localhost:3000/userdata', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          console.error('Failed to fetch cart data');
          return;
        }
        const data = await response.json();
        setCart(data.cart);
        console.log("Cart data for zustand:", data.cart);
        
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    }
    fetchCart();

  },[]);
  return (
    <Router>
      <Routes>
      <Route path="/test" element={<TestPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path ="/home"  element={<HomePage />} />
        <Route path='/about' element={<About />} />

        {/* <Route path="/admin" element={<AdminPage />} />
        <Route path="/seller" element={<SellerPage />} />
        <Route path="/profile" element={<ProfilePage />} /> */}

        {/* Route for search page (game listing) */}
        <Route path="/game" element={<ResultPage />} />
        {/* Route for a specific game */}
        <Route path="/game/:gamename" element={<GamePage />} />

        <Route path='/un' element={<Unauthorized />} />

        <Route path="/result" element={<ResultPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/purchase" element={<PurchasePage />} />


        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register2" element={<Register2 />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<ChatPage />} />

        <Route path="/communities" element={<Communities />} />
        <Route path="/communities/:communityname" element={<CommunityChat />} />
        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
}

export default App;
