// assets.js
const express = require('express');
const router = express.Router();
const { Asset } = require('../models'); // Import the Asset model

// GET /api/assets
router.get('/', async (req, res) => {
  try {
    const assets = await Asset.find().exec();
    res.json(assets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving assets' });
  }
});

// POST /api/assets
router.post('/', async (req, res) => {
  try {
    const { name, symbol, decimals } = req.body;
    const asset = new Asset({ name, symbol, decimals });
    await asset.save();
    res.json(asset);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error creating asset' });
  }
});

// GET /api/assets/:id
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const asset = await Asset.findById(id).exec();
    if (!asset) {
      res.status(404).json({ message: 'Asset not found' });
    } else {
      res.json(asset);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving asset' });
  }
});

// PUT /api/assets/:id
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { name, symbol, decimals } = req.body;
    const asset = await Asset.findByIdAndUpdate(id, { name, symbol, decimals }, { new: true }).exec();
    res.json(asset);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error updating asset' });
  }
});

// DELETE /api/assets/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await Asset.findByIdAndRemove(id).exec();
    res.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting asset' });
  }
});

module.exports = router;