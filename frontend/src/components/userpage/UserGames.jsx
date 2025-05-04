// import React from 'react'
// import GameCard from '../resultpage/GameCard';
// import { useState,useEffect } from 'react';
// import '../../styles/Games.css'

// const UserGames = () => {
//     const [games, setGames] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const gamesPerPage = 10;
  
//     useEffect(() => {
//       const fetchGames = async () => {
//         try {
//           const response = await fetch('http://localhost:3000/user/mygames', {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             credentials: 'include', // Include credentials for sending cookies
//           }); // Replace with your API endpoint
//           const data = await response.json();

//           console.log(data);
//           // Check if the games array is empty and show an alert if true
//           if (data.length === 0) {
//             alert('No games available at the moment.');
//         }
//           setGames(data);
//         } catch (error) {
//           console.error('Error fetching games:', error);
//         }
//       };
  
//       fetchGames();
//     }, []);
  
//     // Calculate the index range for the current page
//     const startIndex = (currentPage - 1) * gamesPerPage;
//     const endIndex = startIndex + gamesPerPage;
//     const currentGames = games.slice(startIndex, endIndex);
  
//     const handleNextPage = () => {
//       if (endIndex < games.length) {
//         setCurrentPage(currentPage + 1);
//       }
//     };
  
//     const handlePreviousPage = () => {
//       if (currentPage > 1) {
//         setCurrentPage(currentPage - 1);
//       }
//     };
  
  
//     return (
//       <div className="games-page">
//         <h1>Games List</h1>
//         <div className="gameslist">
//           {currentGames.map((game) => (
//             <GameCard key={game._id} game_details={game}  showcart={false} />
//           ))}
//         </div>
  
//         <div className="pagination-controls">
//           <button onClick={handlePreviousPage} disabled={currentPage === 1}>
//             Previous
//           </button>
//           <span style={{color:'white'}}>Page {currentPage}</span>
//           <button onClick={handleNextPage} disabled={endIndex >= games.length}>
//             Next
//           </button>
//         </div>
//       </div>
//     );
// }

// export default UserGames


// import React, { useState, useEffect } from 'react';
// import styles from '../../styles/userstyles/userGames.module.css'


// const UserGames = () => {
//   const [games, setGames] = useState([]);
 

//   useEffect(() => {
//     const fetchGames = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/user/mygames', {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           credentials: 'include', 
//         });
  
//         if (!response.ok) {
//           throw new Error(`Error: ${response.status} ${response.statusText}`);
//         }
  
//         const data = await response.json();
//         console.log('Fetched data:', data); 
//         const gamesArray = Array.isArray(data.myGames) ? data.myGames : [];
  
//         if (gamesArray.length === 0) {
//           alert('No games available at the moment.');
//         }
  
//         setGames(gamesArray);
//       } catch (error) {
//         console.error('Error fetching games:', error);
//       }
//     };
  
//     fetchGames();
//   }, []);
  
  
 
//   return (
//     <div className={styles.usergamesPage}>
//     <div className={styles.usergames}>
//       <h1>My Library</h1>
//       <div className={styles.gameslist}>
       
//       </div>

     
//     </div>
//     </div>
//   );
// };

// export default UserGames;



import React, { useState, useEffect } from 'react';
import styles from '../../styles/userstyles/userGames.module.css';

const UserGames = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${backendUrl}/user/mygames`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const gamesArray = Array.isArray(data.myGames) ? data.myGames : [];

        if (gamesArray.length === 0) {
          alert('No games available at the moment.');
        }

        setGames(gamesArray);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className={styles.usergamesPage}>
      <div className={styles.usergames}>
        <h1 className={styles.usergamesheading}>My Library</h1>
        <div className={styles.usergamesGrid}>
          {games.map((game, index) => (
            <div key={index} className={styles.usergameCard}>
              <img src={game.poster} alt={game.game_name} className={styles.poster} />
                <div className={styles.gameDetails}>
                  <h2 className={styles.gameName}>{game.game_name}</h2>
                  <p className={styles.category}>Category: {game.category}</p>
                  <p className={styles.ratings}>Ratings: {game.rating}</p>
                  <p className={styles.seller}>Seller: {game.seller}</p>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserGames;
