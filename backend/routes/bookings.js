const router = require('express').Router();
const Booking = require('../models/Booking');

// @route   GET /api/bookings/user/:userId
router.get('/user/:userId', async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.params.userId }).populate('tripId');
        res.status(200).json(bookings);
    } catch (err) {
        console.error("Error fetching bookings:", err);
        res.status(500).json({ message: "Server error while fetching bookings" });
    }
});

// @route   POST /api/bookings
router.post('/', async (req, res) => {
    try {
        const { userId, tripId, totalAmount, paymentStatus } = req.body;

        if (!userId || !tripId) {
            return res.status(400).json({ message: "Missing required fields (userId or tripId)" });
        }

        const newBooking = new Booking({
            userId,
            tripId,
            totalAmount: totalAmount || 0,
            paymentStatus: paymentStatus || 'Confirmed'
        });

        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);
    } catch (err) {
        console.error("Error creating booking:", err);
        res.status(500).json({ message: err.message || "Server error while creating booking" });
    }
});

module.exports = router;