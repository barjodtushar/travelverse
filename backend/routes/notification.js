const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

router.get('/user/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching notifications' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { userId, message, tripId } = req.body;

    const newNotification = new Notification({
      userId,
      message,
      tripId
    });

    const savedNotification = await newNotification.save();
    res.status(201).json(savedNotification);
  } catch (err) {
    console.error(err);
    res.status(500),json({ message: 'Server error while creating notification' });
  }
});

router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json(notification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;