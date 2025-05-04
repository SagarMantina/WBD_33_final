
// export default GameCard
import './GameCard.css';
import React from 'react';
import { FaWindows, FaApple } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { useState ,useEffect} from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCartStore } from '../../store/cartStore';
const GameCard = ({ game_details}) => {

  const { addToCart, isInCart } = useCartStore();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const fetchGamePage = (game_name) => {
    console.log(game_name);
    navigate(`/game/${game_name}`);
  };

 

  useEffect(() => {
      // Fetch user data (role) when the dashboard is loaded

    
      const getUserData = async () => {
        try {
          const backendUrl = import.meta.env.VITE_BACKEND_URL;
          const response = await fetch(`${backendUrl}/user/role`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                'x-username': localStorage.getItem('username'), // Include username in headers
              },
              credentials: "include", // Include credentials for sending cookies
            }
          ); // Replace with your API endpoint
          
          if (response.ok) {
            const data = await response.json();
            const { role } = data;
            console.log("User data:", role);
            setRole(role);
        } else {
            console.error('Failed to fetch role');
        }
        } catch (error) {
          console.error("Failed to fetch user role:", error);
          setRole("unauthorized");
        } 
      };
  
      getUserData();
    }, []);


  const handleDelete = async (game_name) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/admin/delete_game`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ game_name: game_name }),
        headers: {
          'Content-Type': 'application/json',
          'x-username': localStorage.getItem('username')
        },
      });
  
      if (response.ok) {
        // const data = await response.json();
        // alert(data.successMsg || 'Game added to cart successfully!');
        toast.success("Game deleted successfully!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.errorMessage || 'Error deleting game.');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error deleting game.');
    }
  }
  const handleCart = async (game_name) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${backendUrl}/addtocart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-username': localStorage.getItem('username'), // Include username in headers
            },
            body: JSON.stringify({ cart_games: { game_name } }), // Sending an object containing game_name
            credentials: 'include',
        });

        if (response.ok) {
           addToCart({game_name}); 
           toast.success('Game added to cart successfully!');
        } else {
            const errorData = await response.json();
            toast.error(errorData.errorMessage || 'Error adding game to cart.');
        }
    } catch (error) {
        console.log(error);
        toast.error('Error adding game to cart.');
    }
};
  return (
    <div className="gameCard"  >
      <div className="gameCardImage">
        <img src={game_details.main_image} alt={game_details.name} onClick={() => fetchGamePage(game_details.game_name)} />
      </div>

      <div className="gameCardInfo">
        <p onClick={() => fetchGamePage(game_details.game_name)}>{game_details.game_name}</p>
        <span onClick={() => fetchGamePage(game_details.game_name)}>
          {game_details.releaseDate} <span> </span>
          <FaWindows /> <span> </span>
          <FaApple />
        </span>
        <p>
          <span style={{ color: 'greenyellow' }}>Very Positive</span> |{' '}
          {/* {game_details.reviews.length} User Reviews */}
        </p>
      </div>

      <div className="gameCardPrice">
        <p className="price">&#8377;{game_details.price}</p>
        

        
        {!isInCart(game_details.game_name) ? (
          <p className="cart" onClick={() => handleCart(game_details.game_name)}>
          Add to cart
          </p>
        ) : (
          
          <button disabled>Already in Cart</button>
        )}
        {/* <p className="cart" onClick={() => handleCart(game_details.game_name)}>
          Add to cart
        </p> */}

        {role === 'admin' && (
          <p className='delete' style={{color:'white' , backgroundColor:'red', borderRadius:'5px', margin:'10px', height:'20px', width:'70px' , padding :'10px' , textAlign:'center'}} onClick={() => handleDelete(game_details.game_name)}> Delete </p>
        )}
        
   
      </div>
      <ToastContainer />
    </div>
  );
};

export default GameCard;
