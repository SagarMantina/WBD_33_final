// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { addToCart } from '../../redux/slices/cartSlice';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const CartPurchase = ({ game_name, game_price, setPopUp }) => {
  
//   const dispatch = useDispatch();
//   const { cart, status, error } = useSelector((state) => state.cart);

//   const handleAddToCart = (game) => {
//     dispatch(addToCart(game));
//   };

//   useEffect(() => {
//     if (status === 'added') {
       
//       console.log("Game added to cart successfully!");
//       setPopUp(true); // Show popup if the game is successfully added to the cart
//     } 
//     else if (error) {
//       toast.error(error); 
//     }
//     else if (status === 'rejected') {
//       toast.error('Error adding to cart');
//     }
//   }, [status, error, setPopUp]);

//   const buyGame = () => {
//     toast.warn("Please add the game to your cart to buy.");
//   };

//   return (
//     <div className="cartpurchase">
//       <h1 style={{ fontWeight: 80 }}>{game_name}</h1>

//       <div className="price">
//         <p>&#8377; {game_price}</p>
//         <button onClick={() => handleAddToCart(game_name)}>Add to Cart</button>
//         <button onClick={buyGame}>Buy</button>
//       </div>
//     </div>
//   );
// };

// export default CartPurchase;







// remove redux

// import React, { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import {useCartStore} from '../../store/cartStore'; // Adjust the import path as necessary

// const CartPurchase = ({ game_name, game_price, setPopUp }) => {
//   const { addToCart, setCart, isInCart} = useCartStore(); // Access the cart store
//   const [cartItems, setCartItems] = useState(cart); // Local state to manage cart items
//   const [status, setStatus] = useState('idle'); 
//   const [error, setError] = useState(null); 

//   const handleAddToCart = async (game_name) => {
//     try {
//       setStatus('loading');
//       const response = await fetch('http://localhost:3000/addtocart', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ cart_games: { game_name } }),
//         credentials: 'include',
//       });

//       if (response.ok) {
//         setStatus('added');
//         setPopUp(true); 
//         toast.success('Game added to cart successfully!');
//       } else {
//         const errorData = await response.json();
//         setError(errorData.errorMessage || 'Error adding game to cart.');
//         setStatus('rejected');
//       }
//     } catch (error) {
//       setError('Error adding game to cart.');
//       setStatus('rejected');
//     }
//   };

//   useEffect(() => {
//     if (status === 'added') {
//       console.log("Game added to cart successfully!");
//     } 
  
    
//     else if (status === 'rejected') {
//       toast.error(error);
//     }
//   }, [status, error]);

//   const buyGame = () => {
//     toast.warn("Please add the game to your cart to buy.");
//   };

//   return (
//     <div className="cartpurchase">
//       <h1 style={{ fontWeight: 500 }}>{game_name}</h1>

//       <div className="price">
//         <p>&#8377; {game_price}</p>

//         {
//            if(isInCart(game_name)) {
//             <button onClick={() => handleAddToCart(game_name)}>Add to Cart</button>
//            }
//         };
//         <button onClick={() => handleAddToCart(game_name)}>Add to Cart</button>
//         <button onClick={buyGame}>Buy</button>
//       </div>
//     </div>
//   );
// };

// export default CartPurchase;



import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCartStore } from '../../store/cartStore';

const CartPurchase = ({ game_name, game_price, setPopUp }) => {
  const { addToCart, isInCart } = useCartStore();

  console.log("Check whether its in cart or not"+ isInCart(game_name)); 
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const handleAddToCart = async () => {
    try {
      setStatus('loading');

      const response = await fetch('http://localhost:3000/addtocart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart_games: { game_name } }),
        credentials: 'include',
      });

      if (response.ok) {
       
      

        setStatus('added');
        setPopUp(true);
        toast.success('Game added to cart successfully!');
        addToCart({game_name}); 
      } else {
        const errorData = await response.json();
        setError(errorData.errorMessage || 'Error adding game to cart.');
        setStatus('rejected');
      }
    } catch (err) {
      setError('Error adding game to cart.');
      setStatus('rejected');
    }
  };

  useEffect(() => {
    if (status === 'added') {
      console.log('Game added to cart successfully!');
    } else if (status === 'rejected') {
      toast.error(error);
    }
  }, [status, error]);

  const buyGame = () => {
    toast.warn('Please add the game to your cart to buy.');
  };

  return (
    <div className="cartpurchase">
      <h1 style={{ fontWeight: 500 }}>{game_name}</h1>
      <div className="price">
        <p>&#8377; {game_price}</p>

        {!isInCart(game_name) ? (
          <button onClick={handleAddToCart}>Add to Cart</button>
        ) : (
          
          <button disabled>Already in Cart</button>
        )}

        <button onClick={buyGame}>Buy</button>
      </div>
    </div>
  );
};

export default CartPurchase;
