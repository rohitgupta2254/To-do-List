const express = require('express');
const auth = require('../middleware/auth');
const db = require('../config/database');
const router = express.Router();

// Get all boards for user
router.get('/', auth, async (req, res) => {
    try {
        const [boards] = await db.promise().query(
            'SELECT * FROM boards WHERE user_id = ? ORDER BY created_at DESC',
            [req.userId]
        );
        res.json(boards);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single board
router.get('/:id', auth, async (req, res) => {
    try {
        const [boards] = await db.promise().query(
            'SELECT * FROM boards WHERE id = ? AND user_id = ?',
            [req.params.id, req.userId]
        );

        if (boards.length === 0) {
            return res.status(404).json({ message: 'Board not found' });
        }

        res.json(boards[0]);
    } catch (error) {
        console.error('Error fetching board:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Create board
router.post('/', auth, async (req, res) => {
    try {
        const { title, description } = req.body;
        
        const [result] = await db.promise().query(
            'INSERT INTO boards (title, description, user_id) VALUES (?, ?, ?)',
            [title, description, req.userId]
        );
        
        const [newBoard] = await db.promise().query(
            'SELECT * FROM boards WHERE id = ?',
            [result.insertId]
        );
        
        res.status(201).json(newBoard[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update board
router.put('/:id', auth, async (req, res) => {
    try {
        const { title, description } = req.body;
        
        await db.promise().query(
            'UPDATE boards SET title = ?, description = ? WHERE id = ? AND user_id = ?',
            [title, description, req.params.id, req.userId]
        );
        
        res.json({ message: 'Board updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete board
router.delete('/:id', auth, async (req, res) => {
    try {
        await db.promise().query(
            'DELETE FROM boards WHERE id = ? AND user_id = ?',
            [req.params.id, req.userId]
        );
        
        res.json({ message: 'Board deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;