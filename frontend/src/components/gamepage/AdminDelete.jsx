// const backendUrl = import.meta.env.VITE_BACKEND_URL;
const backendUrl = 'https://p2p-final-backend.onrender.com';
const AdminDelete = ({ game_name, onDelete }) => {

  console.log("Game name in AdminDelete: ", game_name);
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      try {
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
          onDelete(game_name);
          alert('Game deleted successfully!');
          // redirect to home page
          window.location.href = '/';
        } else {
          const errorData = await response.json();
          alert(`Error deleting game: ${errorData.errorMessage || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error deleting game:', error);
        alert('Error deleting game');
      }
    }
  };

  return (
    <div className="admin-delete-game">
        <button onClick={handleDelete} className="delete-button">Delete Game</button>
    </div>
  );
}

export default AdminDelete;
