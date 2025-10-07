import React, { useState } from 'react';
import axios from 'axios';
import Card from './Card';

const List = ({ list, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(list.title);
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [newCard, setNewCard] = useState({ title: '', description: '' });
  // ...existing code...

  const updateList = async () => {
    if (!title.trim() || title === list.title) {
      setTitle(list.title);
      setEditing(false);
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/lists/${list.id}`, {
        title: title
      });
      setEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating list:', error);
      setTitle(list.title);
      setEditing(false);
    }
  };

  const deleteList = async () => {
    if (!window.confirm('Are you sure you want to delete this list and all its cards?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/lists/${list.id}`);
      onUpdate();
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  const createCard = async (e) => {
    e.preventDefault();
    if (!newCard.title.trim()) return;

    try {
      await axios.post('http://localhost:5000/api/cards', {
        ...newCard,
        list_id: list.id
      });
      setNewCard({ title: '', description: '' });
      setShowNewCardForm(false);
      onUpdate();
    } catch (error) {
      console.error('Error creating card:', error);
    }
  };

  return (
    <div className="list">
      <div className="list-header">
        {editing ? (
          <input
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={updateList}
            onKeyPress={(e) => e.key === 'Enter' && updateList()}
            autoFocus
          />
        ) : (
          <>
            <div 
              className="list-title"
              onClick={() => setEditing(true)}
            >
              {list.title}
            </div>
            <button 
              className="delete-list-btn"
              onClick={deleteList}
              title="Delete list"
            >
              ×
            </button>
          </>
        )}
      </div>

      {/* ...existing code... */}

      <div className="list-cards">
        {list.cards && list.cards.map(card => (
          <Card key={card.id} card={card} onUpdate={onUpdate} />
        ))}
        
        {showNewCardForm ? (
          <div className="card">
            <form onSubmit={createCard}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter card title..."
                  value={newCard.title}
                  onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
                  autoFocus
                />
              </div>
              <div className="form-group">
                <textarea
                  className="form-input form-textarea"
                  placeholder="Enter description (optional)"
                  value={newCard.description}
                  onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
                />
              </div>
              <div className="flex space-between">
                <button type="submit" className="btn btn-primary btn-small">
                  Add Card
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-small"
                  onClick={() => {
                    setShowNewCardForm(false);
                    setNewCard({ title: '', description: '' });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'flex-start' }}
            onClick={() => setShowNewCardForm(true)}
          >
            + Add a card
          </button>
        )}
      </div>
    </div>
  );
};

export default List;