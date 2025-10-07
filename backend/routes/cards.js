const express = require('express');
const auth = require('../middleware/auth');
const db = require('../config/database');
const router = express.Router();

// Create card
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, list_id } = req.body;

        const [result] = await db.promise().query(
            'INSERT INTO cards (title, description, list_id) VALUES (?, ?, ?)',
            [title, description, list_id]
        );

        const [newCard] = await db.promise().query(
            'SELECT * FROM cards WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json(newCard[0]);
    } catch (error) {
        console.error('Error creating card:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update card
router.put('/:id', auth, async (req, res) => {
    try {
        const { title, description } = req.body;

        await db.promise().query(
            'UPDATE cards SET title = ?, description = ? WHERE id = ?',
            [title, description, req.params.id]
        );

        res.json({ message: 'Card updated successfully' });
    } catch (error) {
        console.error('Error updating card:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete card
router.delete('/:id', auth, async (req, res) => {
    try {
        await db.promise().query('DELETE FROM cards WHERE id = ?', [req.params.id]);
        res.json({ message: 'Card deleted successfully' });
    } catch (error) {
        console.error('Error deleting card:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;