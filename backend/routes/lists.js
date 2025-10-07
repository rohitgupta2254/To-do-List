const express = require('express');
const auth = require('../middleware/auth');
const db = require('../config/database');
const router = express.Router();

// Get all lists for a board
router.get('/board/:boardId', auth, async (req, res) => {
    try {
        const [lists] = await db.promise().query(
            'SELECT * FROM lists WHERE board_id = ? ORDER BY position ASC',
            [req.params.boardId]
        );

        // Get cards for each list
        for (let list of lists) {
            const [cards] = await db.promise().query(
                'SELECT * FROM cards WHERE list_id = ? ORDER BY position ASC',
                [list.id]
            );
            list.cards = cards;
        }

        res.json(lists);
    } catch (error) {
        console.error('Error fetching lists:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create list
router.post('/', auth, async (req, res) => {
    try {
        const { title, board_id } = req.body;

        // Verify board belongs to user
        const [boards] = await db.promise().query(
            'SELECT id FROM boards WHERE id = ? AND user_id = ?',
            [board_id, req.userId]
        );

        if (boards.length === 0) {
            return res.status(404).json({ message: 'Board not found' });
        }

        const [result] = await db.promise().query(
            'INSERT INTO lists (title, board_id) VALUES (?, ?)',
            [title, board_id]
        );

        const [newList] = await db.promise().query(
            'SELECT * FROM lists WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json(newList[0]);
    } catch (error) {
        console.error('Error creating list:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update list
router.put('/:id', auth, async (req, res) => {
    try {
        const { title } = req.body;

        await db.promise().query(
            'UPDATE lists SET title = ? WHERE id = ?',
            [title, req.params.id]
        );

        res.json({ message: 'List updated successfully' });
    } catch (error) {
        console.error('Error updating list:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete list
router.delete('/:id', auth, async (req, res) => {
    try {
        await db.promise().query('DELETE FROM lists WHERE id = ?', [req.params.id]);
        res.json({ message: 'List deleted successfully' });
    } catch (error) {
        console.error('Error deleting list:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;