const router = require('express').Router();
const Trip = require('../models/Trip');
const Expense = require('../models/Expense');
const User = require('../models/User'); // Required to fetch user email/name for collaboration checks

// @route   POST /api/trips
// @desc    Create a new trip
router.post('/', async (req, res) => {
    try {
        // Accept userId/destinationId, user/destination, and members from req.body
        const { userId, destinationId, user, destination, title, startDate, endDate, budget, members } = req.body;

        // Clean up members array to ensure it saves properly as strings/emails
        let formattedMembers = [];
        if (Array.isArray(members)) {
            formattedMembers = members.map(m => typeof m === 'string' ? m.trim() : m.email).filter(Boolean);
        } else if (typeof members === 'string' && members.trim().length > 0) {
            formattedMembers = members.split(',').map(m => m.trim()).filter(Boolean);
        }

        const newTrip = new Trip({
            user: user || userId,
            userId: user || userId,
            destination: destination || destinationId,
            destinationId: destination || destinationId,
            title,
            startDate,
            endDate,
            budget,
            members: formattedMembers // Save clean array of strings
        });

        const savedTrip = await newTrip.save();
        res.status(201).json(savedTrip);
    } catch (err) {
        console.error("Error creating trip:", err);
        res.status(500).json({ message: err.message || 'Server error while creating trip' });
    }
});

// @route   GET /api/trips/user/:userId
// @desc    Get all trips for a specific user (created by them or where they are added as a member)
router.get('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Fetch current user details to check against shared trip members
        const currentUser = await User.findById(userId);

        let queryConditions = [
            { userId: userId },
            { user: userId }
        ];

        if (currentUser) {
            if (currentUser.email) {
                queryConditions.push({ members: currentUser.email });
            }
            if (currentUser.name) {
                queryConditions.push({ members: currentUser.name });
            }
        }

        const trips = await Trip.find({ 
            $or: queryConditions 
        }).populate('destination').populate('destinationId');

        res.status(200).json(trips);
    } catch (err) {
        console.error("Error fetching user trips:", err);
        res.status(500).json({ message: 'Server error while fetching trips' });
    }
});

// @route   PUT /api/trips/:id
// @desc    Update a trip
router.put('/:id', async (req, res) => {
    try {
        const updatedTrip = await Trip.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!updatedTrip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        res.status(200).json(updatedTrip);
    } catch (err) {
        console.error("Error updating trip:", err);
        res.status(500).json({ message: 'Server error while updating trip' });
    }
});

// @route   DELETE /api/trips/:id
// @desc    Delete a trip and its associated expenses
router.delete('/:id', async (req, res) => {
    try {
        const tripId = req.params.id;
        await Trip.findByIdAndDelete(tripId);
        await Expense.deleteMany({ tripId });
        res.status(200).json({ message: 'Trip and associated expenses deleted successfully' });
    } catch (err) {
        console.error("Error deleting trip:", err);
        res.status(500).json({ message: 'Server error while deleting trip' });
    }
});

module.exports = router;