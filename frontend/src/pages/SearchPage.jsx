// import { useLocation } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import Header from './Header';

// const SearchPage = () => {
//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);
//   const term = searchParams.get('term'); 
//   const [games, setGames] = useState([]);

//   useEffect(() => {
//     const fetchGames = async () => {
//       try {
//         const response = await fetch(`http://localhost:3000/games?term=${term}`);
//         const data = await response.json();
//         console.log(data);
//         setGames(data);
//       } catch (error) {
//         console.error('Error fetching games:', error);
//       }
//     };

//     if (term) {
//       fetchGames(); 
//     }
//   }, []); 

//   return (
//   <>
//     <Header />
//     <div>
//       <h1>Search Results for: {term}</h1>
//       <ul>
//         {games.map((game, index) => (
//           <li key={game.id || index}>{game._id}</li> 
//         ))}
//       </ul>
//     </div>
//   </>
//   );
// };

// export default SearchPage;



// remove redux 

import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './Header';

const SearchPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const term = searchParams.get('term'); 
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`http://localhost:3000/games?term=${term}`);
        const data = await response.json();
        console.log(data);
        setGames(data);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    if (term) {
      fetchGames(); 
    }
  }, []); 

  return (
  <>
    <Header />
    <div>
      <h1>Search Results for: {term}</h1>
      <ul>
        {games.map((game, index) => (
          <li key={game.id || index}>{game._id}</li> 
        ))}
      </ul>
    </div>
  </>
  );
};

export default SearchPage;
