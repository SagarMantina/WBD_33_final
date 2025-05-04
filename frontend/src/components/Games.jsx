import React, { useEffect, useState } from 'react';
import '../styles/Games.css';
import GameCard from './resultpage/GameCard';

const Games = () => {
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 10;

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${backendUrl}/allgames`); // Replace with your API endpoint
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, []);

  // Calculate the index range for the current page
  const startIndex = (currentPage - 1) * gamesPerPage;
  const endIndex = startIndex + gamesPerPage;
  const currentGames = games.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (endIndex < games.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };



  return (
    <div className="admin-games-page">
      <h1>Games List</h1>
      <div className="admin-gameslist">
        {currentGames.map((game) => (
          <GameCard key={game._id} game_details={game}  showcart={false} />
        ))}
      </div>

      <div className="pagination-controls">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button onClick={handleNextPage} disabled={endIndex >= games.length}>
          Next
        </button>
      </div>

    </div>
  );
};

export default Games;