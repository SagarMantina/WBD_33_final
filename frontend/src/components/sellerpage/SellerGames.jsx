import React, { useState, useEffect } from 'react';
import '../../styles/Games.css';

const UserGames = () => {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    game_name: '',
    price: '',
    category: '',
  });

  // const categories = [
  //   'ACTION', 'ADVENTURE', 'ANIME', 'BRAIN STORMING', 'BUILDING', 'CASUAL',
  //   'CO-OP', 'HORROR', 'MYSTERY', 'OPEN WORLD', 'RPG', 'SCI-FI', 'SPACE',
  //   'SPORTS', 'STRATEGY', 'SURVIVAL'
  // ];


  const categories = ['Action', 'Adventure', 'Anime', 'Brain Storming', 'Building', 'Casual',
    'Co-op', 'Horror', 'Mystery', 'Open World', 'RPG', 'Sci-fi', 'Space',
    'Sports', 'Strategy', 'Survival'
  ];
  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/seller/mygames`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-username': localStorage.getItem('username'), // Include username in headers
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const gamesArray = Array.isArray(data.myGames) ? data.myGames : [];
      setGames(gamesArray);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const handleGameClick = (game) => {
    setSelectedGame(game);
    setUpdateForm({
      game_name: game.game_name,
      price: game.price,
      category: game.category,
    });
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/seller/update_game/${selectedGame._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-username': localStorage.getItem('username'), // Include username in headers
        },
        credentials: 'include',
        body: JSON.stringify(updateForm),
      });
      console.log(response.status);

      if (response.ok) {
        fetchGames();
        setSelectedGame(null);
        alert('Game updated successfully!');
      } 
   
      else {
        const errorData = await response.json();
        alert(`Error updating game: ${errorData.errorMessage || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating game:', error);
      alert('Error updating game');
    }
  };

  const handleDeleteGame = async (gameId) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${backendUrl}/seller/delete_game/${gameId}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'x-username': localStorage.getItem('username'), // Include username in headers
          },
        });

        if (response.ok) {
          fetchGames();
          alert('Game deleted successfully!');
        } else {
          throw new Error('Failed to delete game');
        }
      } catch (error) {
        console.error('Error deleting game:', error);
        alert('Error deleting game');
      }
    }
  };

  return (
    <div className="admin-games-page">
      <h1>Manage Your Games</h1>
      <div className="admin-gameslist">
        {games.map((game) => (
          <div key={game._id} className="game-item">
            <div className="game-content" onClick={() => handleGameClick(game)}>
              <div className="game-poster">
                <img src={game.poster} alt={game.game_name} />
              </div>
              <div className="game-info" style={{ color: "#333", flex: 1 }}>
    <h3 className="game-title" style={{ margin: "0 0 8px 0", fontSize: "1.2rem", color: "#ffd700", padding: "0 25px" }}>
      {game.game_name}
    </h3>
    <div className="game-rating" style={{ marginBottom: "8px", fontSize: "14px", color: "#777" }}>
      <span className="rating-value" style={{ fontSize: "13px", fontWeight: "bold", color: "#ff9800", marginLeft: "25px" }}>
        {game.rating || 0}
      </span>
      <span className="rating-stars" style={{ fontSize: "13px", marginLeft: "10px", color: "#ff9800" }}>
        ★
      </span>
    </div>
    <div className="game-price" style={{ fontSize: "20px", color: "#2e7d32", fontWeight: "bold", marginBottom: "6px" ,padding: "0 25px" }}>
      ₹{game.price}
    </div>
    <div className="game-category" style={{ fontSize: "20px", color: "#555" ,padding: "0 25px" }}>
      {game.category}
    </div>
  </div>
            </div>
            <button 
              className="delete-button"
              onClick={() => handleDeleteGame(game._id)}
            >
              Delete Game
            </button>
          </div>
        ))}
      </div>

      {selectedGame && (
        <div className="update-form-overlay">
          <div className="update-form-container">
            <h2>Update Game: {selectedGame.game_name}</h2>
            <form onSubmit={handleUpdateSubmit}>
              <div className="form-group">
                <label>Game Name:</label>
                <input
                  type="text"
                  name="game_name"
                  value={updateForm.game_name}
                  onChange={handleUpdateChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price:</label>
                <input
                  type="number"
                  name="price"
                  value={updateForm.price}
                  onChange={handleUpdateChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category:</label>
                <select
                  name="category"
                  value={updateForm.category}
                  onChange={handleUpdateChange}
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-buttons">
                <button type="submit">Update</button>
                <button type="button" onClick={() => setSelectedGame(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserGames;
