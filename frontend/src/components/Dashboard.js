import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBoard, setNewBoard] = useState({ title: '', description: '' });
  const [error, setError] = useState('');
  // ...existing code...

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/boards');
      setBoards(response.data);
    } catch (error) {
      console.error('Error fetching boards:', error);
      setError('Failed to load boards');
    }
  };

  const createBoard = async (e) => {
    e.preventDefault();
    if (!newBoard.title.trim()) return;

    try {
      const response = await axios.post('http://localhost:5000/api/boards', newBoard);
      setBoards([...boards, response.data]);
      setNewBoard({ title: '', description: '' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating board:', error);
      setError('Failed to create board');
    }
  };

  const deleteBoard = async (boardId) => {
    if (!window.confirm('Are you sure you want to delete this board?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/boards/${boardId}`);
      setBoards(boards.filter(board => board.id !== boardId));
    } catch (error) {
      console.error('Error deleting board:', error);
      setError('Failed to delete board');
    }
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Your Boards</h1>
          <p>Manage your tasks and projects efficiently</p>
        </div>

        {error && (
          <div className="error-message" style={{ 
            background: '#ffebe6', 
            color: '#cf513d', 
            padding: '16px', 
            borderRadius: '3px',
            margin: '16px 0'
          }}>
            {error}
          </div>
        )}
        {/* ...existing code... */}

        <div className="boards-grid">
          {boards.map(board => (
            <div key={board.id} className="board-card-container">
              <Link to={`/board/${board.id}`} className="board-card">
                {board.title}
              </Link>
              <button
                className="btn btn-danger btn-small mt-1"
                onClick={() => deleteBoard(board.id)}
                style={{ width: '100%' }}
              >
                Delete Board
              </button>
            </div>
          ))}
          
          {showCreateForm ? (
            <div className="card">
              <form onSubmit={createBoard}>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Board title"
                    value={newBoard.title}
                    onChange={(e) => setNewBoard({ ...newBoard, title: e.target.value })}
                    autoFocus
                    required
                  />
                </div>
                <div className="form-group">
                  <textarea
                    className="form-input form-textarea"
                    placeholder="Board description (optional)"
                    value={newBoard.description}
                    onChange={(e) => setNewBoard({ ...newBoard, description: e.target.value })}
                  />
                </div>
                <div className="flex space-between">
                  <button type="submit" className="btn btn-primary btn-small">
                    Create
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-small"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div
              className="board-card create-board-card"
              onClick={() => setShowCreateForm(true)}
            >
              Create new board
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;