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
      const response = await fetch('http://localhost:3000/seller/mygames', {
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
      const response = await fetch(`http://localhost:3000/seller/update_game/${selectedGame._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
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
        const response = await fetch(`http://localhost:3000/seller/delete_game/${gameId}`, {
          method: 'DELETE',
          credentials: 'include',
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
    <div className="games-page">
      <h1>Manage Your Games</h1>
      <div className="gameslist">
        {games.map((game) => (
          <div key={game._id} className="game-item">
            <div className="game-content" onClick={() => handleGameClick(game)}>
              <div className="game-poster">
                <img src={game.poster} alt={game.game_name} />
              </div>
              <div className="game-info">
                <h3 className="game-title">{game.game_name}</h3>
                <div className="game-rating">
                  <span className="rating-value">{game.rating || 0}</span>
                  <span className="rating-stars">★</span>
                </div>
                <div className="game-price">${game.price}</div>
                <div className="game-category">{game.category}</div>
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
