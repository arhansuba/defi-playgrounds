// users.js
const express = require('express');
const router = express.Router();
const { User } = require('../models'); // Import the User model

// GET /api/users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().exec();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving users' });
  }
});

// POST /api/users
router.post('/', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error creating user' });
  }
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).exec();
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.json(user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving user' });
  }
});

// PUT /api/users/:id
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { username, email, password } = req.body;
    const user = await User.findByIdAndUpdate(id, { username, email, password }, { new: true }).exec();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error updating user' });
  }
});

// DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await User.findByIdAndRemove(id).exec();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router;