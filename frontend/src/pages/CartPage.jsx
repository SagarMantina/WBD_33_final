
// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import CartCard from '../components/cartpage/CartCard';
// import './CartPage.css';
// import { LoadingScreen } from '../components/LoadingScreen';
// import { Link } from 'react-router-dom';
// import Header from './Header'
// import {
//   fetchCartGames,
//   removeFromCart,
// } from '../redux/slices/cartSlice';
// import Footer from './Footer';

// const CartPage = () => {
//   const dispatch = useDispatch();
//   const { cart, status, error } = useSelector((state) => state.cart);

//   // Calculate total amount
//   const totalAmount = cart.reduce((sum, game) => sum + game.price, 0);

//   useEffect(() => {
//     dispatch(fetchCartGames());
//   }, [dispatch]);

//   const handleRemoveGame = (game) => {
//     dispatch(removeFromCart(game));
//   };

//   const handleRemoveAllGames = () => {
//     cart.forEach((game) => {
//       dispatch(removeFromCart(game.game_name));
//     });
//   };

//   if (status === 'loading') {
//     return <LoadingScreen />;
//   }

//   if (status === 'failed') {
//     return <div>Error: {error}</div>;
//   }

//   return (
//    <>
//    <Header />
//    <div className="cartPage">
//       <h1>Your Shopping Cart</h1>
//       <div className="cartpagemain">
//         <div className="cartgames">
//           {cart.length > 0 ? (
//             cart.map((game, index) => (
//               <div key={index}>
//                 <CartCard
//                   game_image={game.main_image}
//                   game_name={game.game_name}
//                   game_price={game.price}
//                   removeGame={() => handleRemoveGame(game.game_name)}
//                 />
//               </div>
//             ))
//           ) : (
//             <div className="emptycart">
//               <video src="/EmptyCart.mp4" autoPlay loop muted />
//               <p>Your cart is Empty</p>
//               <p>Looks like you haven't made your choice yet.</p>
//               <button>
//                 <Link to="/">Start Shopping</Link>
//               </button>
//             </div>
//           )}

//           {cart.length > 0 && (
//             <div className="cartcontrols">
//               <button> <Link to='/'>Continue Shopping</Link> </button>
//               <p onClick={handleRemoveAllGames}>Remove all Items</p>
//             </div>
//           )}
//         </div>
//         {cart.length > 0 && (
//           <div className="paymentcard">
//             <div className="estimatedTotal">
//               <h3 style={{ fontWeight: '10' }}>Estimated Price</h3>
//               <p>&#8377;{totalAmount}</p>
//             </div>
//             <p style={{ color: 'gray', width: '70%', fontSize: '15px' }}>
//               Sales tax will be calculated during checkout where applicable
//             </p>
//             <button className="paymentBtn">
//               <Link to="/payment">Continue to Payment</Link>
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//     <Footer />
//    </>
//   );
// };

// export default CartPage;



// remove redux 


// import React, { useEffect } from 'react';

// import CartCard from '../components/cartpage/CartCard';
// import './CartPage.css';
// import { LoadingScreen } from '../components/LoadingScreen';
// import { Link } from 'react-router-dom';
// import Header from './Header'

// import Footer from './Footer';

// const CartPage = () => {
 
//   const [status, setStatus] = React.useState('loading');
//   const [cart, setCart] = React.useState([]);

//   // Calculate total amount
//   const totalAmount = cart.reduce((sum, game) => sum + game.price, 0);

//   useEffect(() => {
   

//     const fetchCartGames = async ()=> {
//       try {
//         const response = await fetch('http://localhost:3000/getcartgames', {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           credentials: 'include',
//         });
  
//         if (!response.ok) {
//           throw new Error('Failed to fetch cart games');
//         }
  
//         const data = await response.json();
//         return data; 
//       } catch (error) {
//         return rejectWithValue(error.message || 'Error fetching cart games');
//       }
//     }

//     fetchCartGames();
//   }, []);

//   const handleRemoveGame = (game) => {
//     fetch('http://localhost:3000/removefromcart', {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ game_name: game }),
//       credentials: 'include',
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         setCart((prevCart) => prevCart.filter((item) => item.game_name !== game));
//         console.log(data.message); // Success message
//       })
//       .catch((error) => {
//         console.error('Error removing game from cart:', error);
//       });
//   };

//   const handleRemoveAllGames = () => {
//     cart.forEach((game) => {
//       handleRemoveGame(game.game_name);
//     });
//   };

//   if (status === 'loading') {
//     return <LoadingScreen />;
//   }

//   if (status === 'failed') {
//     return <div>Error: {error}</div>;
//   }

//   return (
//    <>
//    <Header />
//    <div className="cartPage">
//       <h1>Your Shopping Cart</h1>
//       <div className="cartpagemain">
//         <div className="cartgames">
//           {cart.length > 0 ? (
//             cart.map((game, index) => (
//               <div key={index}>
//                 <CartCard
//                   game_image={game.main_image}
//                   game_name={game.game_name}
//                   game_price={game.price}
//                   removeGame={() => handleRemoveGame(game.game_name)}
//                 />
//               </div>
//             ))
//           ) : (
//             <div className="emptycart">
//               <video src="/EmptyCart.mp4" autoPlay loop muted />
//               <p>Your cart is Empty</p>
//               <p>Looks like you haven't made your choice yet.</p>
//               <button>
//                 <Link to="/">Start Shopping</Link>
//               </button>
//             </div>
//           )}

//           {cart.length > 0 && (
//             <div className="cartcontrols">
//               <button> <Link to='/'>Continue Shopping</Link> </button>
//               <p onClick={handleRemoveAllGames}>Remove all Items</p>
//             </div>
//           )}
//         </div>
//         {cart.length > 0 && (
//           <div className="paymentcard">
//             <div className="estimatedTotal">
//               <h3 style={{ fontWeight: '10' }}>Estimated Price</h3>
//               <p>&#8377;{totalAmount}</p>
//             </div>
//             <p style={{ color: 'gray', width: '70%', fontSize: '15px' }}>
//               Sales tax will be calculated during checkout where applicable
//             </p>
//             <button className="paymentBtn">
//               <Link to="/payment">Continue to Payment</Link>
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//     <Footer />
//    </>
//   );
// };

// export default CartPage;



import React, { useEffect, useState } from 'react';
import CartCard from '../components/cartpage/CartCard';
import './CartPage.css';
import { LoadingScreen } from '../components/LoadingScreen';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { toast, ToastContainer } from 'react-toastify';
import { useCartStore } from '../store/cartStore';
const CartPage = () => {
  const { removeFromCart , clearCart } = useCartStore();
  const [status, setStatus] = useState('loading');
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);

  // Calculate total amount whenever cart changes
  const totalAmount = cart.reduce((sum, game) => sum + (game.price || 0), 0);

  useEffect(() => {
    const fetchCartGames = async () => {
      try {
        setStatus('loading');
        const response = await fetch('http://localhost:3000/getcartgames', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch cart games');
        }

        if(response.ok)
          {
            const data = await response.json();
            setCart(data);
            setStatus('success');
          }
      } catch (error) {
        setError(error.message);
        setStatus('failed');
        toast.error('Failed to load cart items');
      }
    };

    fetchCartGames();
  }, []);

  const handleRemoveGame = async (gameName) => {
    try {
      const response = await fetch('http://localhost:3000/removetocart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart_games: gameName }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error removing game:', errorData);
        throw new Error('Failed to remove game from cart');
      }
      if(response.ok)
      {
      setCart(prevCart => prevCart.filter(item => item.game_name !== gameName));
      toast.success('Game removed from cart');
      removeFromCart(gameName); 
      }
    } catch (error) {
      toast.error(error.message);
      console.error('Error removing game from cart:', error);
    }
  };

  // const handleRemoveAllGames = async () => {

      
  //     try {
  //       await Promise.all(
  //         cart.map(game => 
  //           fetch('http://localhost:3000/removetocart', {
  //             method: 'DELETE',
  //             headers: {
  //               'Content-Type': 'application/json',
  //             },
  //             body: JSON.stringify({ cart_games: game.game_name }),
  //             credentials: 'include',
  //           })
  //         )
  //       );
       
  //       if(response.ok)
  //       {
  //       setCart([]);
  //       toast.success('All items removed from cart');
  //       clearCart(); // Clear the cart in the store
  //       }
  //     } catch (fallbackError) {
  //       toast.error('Failed to clear cart');
  //       console.error('Error removing all games:', fallbackError);
  //     }
    
  // };
  const handleRemoveAllGames = async () => {
    try {
      const responses = await Promise.all(
        cart.map(game => 
          fetch('http://localhost:3000/removetocart', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cart_games: game.game_name }),
            credentials: 'include',
          })
        )
      );
  
      // Check if all responses are ok
      const allSuccess = responses.every(res => res.ok);
  
      if (allSuccess) {
        setCart([]); // Clear the cart in the state
        
        clearCart(); 

        toast.success('All items removed from cart');
      } else {
        toast.error('Some items could not be removed');
        console.warn('Some delete requests failed:', responses);
      }
  
    } catch (fallbackError) {
      toast.error('Failed to clear cart');
      console.error('Error removing all games:', fallbackError);
    }
  };
  
  if (status === 'loading') {
    return <LoadingScreen />;
  }

  if (status === 'failed') {
    return (
      <>
        <Header />
        <div className="cartPage">
          <h1>Your Shopping Cart</h1>
          <div className="error-message">
            <p>Error: {error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="cartPage">
        <h1>Your Shopping Cart</h1>
        <div className="cartpagemain">
          <div className="cartgames">
            {cart.length > 0 ? (
              <>
                {cart.map((game, index) => (
                  <div key={`${game.game_name}-${index}`}>
                    <CartCard
                      game_image={game.main_image}
                      game_name={game.game_name}
                      game_price={game.price}
                      removeGame={() => handleRemoveGame(game.game_name)}
                    />
                  </div>
                ))}
                <div className="cartcontrols">
                  <button>
                    <Link to='/'>Continue Shopping</Link>
                  </button>
                  <p onClick={handleRemoveAllGames}>Remove all Items</p>
                </div>
              </>
            ) : (
              <div className="emptycart">
                <video src="/EmptyCart.mp4" autoPlay loop muted />
                <p>Your cart is Empty</p>
                <p>Looks like you haven't made your choice yet.</p>
                <button>
                  <Link to="/">Start Shopping</Link>
                </button>
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="paymentcard">
              <div className="estimatedTotal">
                <h3 style={{ fontWeight: '10' }}>Estimated Price</h3>
                <p>&#8377;{totalAmount.toFixed(2)}</p>
              </div>
              <p style={{ color: 'gray', width: '70%', fontSize: '15px' }}>
                Sales tax will be calculated during checkout where applicable
              </p>
              <button className="paymentBtn">
                <Link to="/payment">Continue to Payment</Link>
              </button>
            </div>
          )}
        </div>
        <ToastContainer />
      </div>
      
      <Footer />
    </>
  );
};

export default CartPage;