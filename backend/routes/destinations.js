const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');

// @route   GET /api/destinations
// @desc    Get all travel destinations
router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.json(destinations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching destinations' });
  }
});

// @route   POST /api/destinations
// @desc    Add a new destination (Admin/Testing purpose)
router.post('/', async (req, res) => {
  try {
    const { title, location, price, description, image, rating } = req.body;

    const newDestination = new Destination({
      title,
      location,
      price,
      description,
      image,
      rating
    });

    const savedDestination = await newDestination.save();
    res.status(201).json(savedDestination);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while adding destination' });
  }
});

module.exports = router;