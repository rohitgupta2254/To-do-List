import React, { useState } from 'react';
import axios from 'axios';

const Card = ({ card, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [cardData, setCardData] = useState({
    title: card.title,
    description: card.description
  });
  // ...existing code...

  const updateCard = async () => {
    try {
      await axios.put(`http://localhost:5000/api/cards/${card.id}`, cardData);
      setEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  const deleteCard = async () => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/cards/${card.id}`);
      onUpdate();
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  if (editing) {
    return (
      <div className="card">
        <form onSubmit={(e) => { e.preventDefault(); updateCard(); }}>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              value={cardData.title}
              onChange={(e) => setCardData({ ...cardData, title: e.target.value })}
              autoFocus
            />
          </div>
          <div className="form-group">
            <textarea
              className="form-input form-textarea"
              value={cardData.description}
              onChange={(e) => setCardData({ ...cardData, description: e.target.value })}
              placeholder="Add a more detailed description..."
            />
          </div>
          <div className="flex space-between">
            <button type="submit" className="btn btn-primary btn-small">
              Save
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-small"
              onClick={() => {
                setEditing(false);
                setCardData({ title: card.title, description: card.description });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="card-item">
      {/* ...existing code... */}
      <div onClick={() => setEditing(true)}>
        <div className="card-title">{card.title}</div>
        {card.description && (
          <div className="card-description">
            {card.description}
          </div>
        )}
      </div>
      <div className="card-actions">
        <small style={{ color: '#6b778c' }}>
          {new Date(card.updated_at).toLocaleDateString()}
        </small>
        <button
          className="btn btn-danger btn-small"
          onClick={deleteCard}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Card;