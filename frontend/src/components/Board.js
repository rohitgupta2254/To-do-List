import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import List from './List';

const Board = () => {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [showNewListForm, setShowNewListForm] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBoard();
    fetchLists();
  }, [id]);

  const fetchBoard = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/boards/${id}`);
      setBoard(response.data);
    } catch (error) {
      console.error('Error fetching board:', error);
      setError('Failed to load board');
    }
  };

  const fetchLists = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/lists/board/${id}`);
      setLists(response.data);
    } catch (error) {
      console.error('Error fetching lists:', error);
      setError('Failed to load lists');
    }
  };

  const createList = async (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;

    try {
      const response = await axios.post('http://localhost:5000/api/lists', {
        title: newListTitle,
        board_id: parseInt(id)
      });
      setLists([...lists, response.data]);
      setNewListTitle('');
      setShowNewListForm(false);
    } catch (error) {
      console.error('Error creating list:', error);
      setError('Failed to create list');
    }
  };

  if (error) {
    return (
      <div className="board-container">
        <div className="container">
          <div className="error-message" style={{ 
            background: '#ffebe6', 
            color: '#cf513d', 
            padding: '16px', 
            borderRadius: '3px',
            margin: '16px 0'
          }}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="board-container">
        <div className="container">
          <div className="flex flex-center" style={{ height: '200px', color: 'white' }}>
            <div>Loading board...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="board-container">
      <div className="container">
        <div className="board-header">
          <h1 className="board-title">{board.title}</h1>
          {board.description && (
            <p className="board-description">{board.description}</p>
          )}
        </div>

        <div className="lists-container">
          {lists.map(list => (
            <List 
              key={list.id} 
              list={list} 
              onUpdate={fetchLists}
            />
          ))}
          
          {showNewListForm ? (
            <div className="list">
              <form onSubmit={createList}>
                <input
                  type="text"
                  className="form-input mb-1"
                  placeholder="Enter list title..."
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  autoFocus
                />
                <div className="flex space-between">
                  <button type="submit" className="btn btn-primary btn-small">
                    Add List
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-small"
                    onClick={() => {
                      setShowNewListForm(false);
                      setNewListTitle('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div 
              className="list"
              style={{ background: 'rgba(255, 255, 255, 0.2)', cursor: 'pointer' }}
              onClick={() => setShowNewListForm(true)}
            >
              <div className="text-center" style={{ color: 'white', padding: '20px' }}>
                + Add another list
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Board;