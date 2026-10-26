const router = require('express').Router();
const Expense = require('../models/Expense');

// @route   POST /api/expenses
router.post('/', async (req, res) => {
    try {
        const { tripId, title, amount, category, paidBy } = req.body;

        if (!tripId || !title || !amount) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newExpense = new Expense({
            tripId,
            title,
            amount: Number(amount),
            category: category || 'General',
            paidBy: paidBy || 'You'
        });

        const savedExpense = await newExpense.save();
        res.status(201).json(savedExpense);
    } catch (err) {
        console.error("Error adding expense:", err);
        res.status(500).json({ message: err.message || "Failed to add expense" });
    }
});

// @route   GET /api/expenses/trip/:tripId
router.get('/trip/:tripId', async (req, res) => {
    try {
        const expenses = await Expense.find({ tripId: req.params.tripId });
        res.status(200).json(expenses);
    } catch (err) {
        console.error("Error fetching expenses:", err);
        res.status(500).json({ message: "Error fetching expenses" });
    }
});

// @route   DELETE /api/expenses/:id
// @route   DELETE /api/expenses/:id
router.delete('/:id', async (req, res) => {
    try {
        const expenseId = req.params.id;
        
        // Check if ID is valid MongoDB ObjectId
        if (!expenseId || expenseId === 'undefined') {
            return res.status(400).json({ message: "Invalid expense ID" });
        }

        const deletedExpense = await Expense.findByIdAndDelete(expenseId);
        
        if (!deletedExpense) {
            return res.status(404).json({ message: "Expense not found in database" });
        }
        
        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (err) {
        console.error("Error deleting expense:", err);
        res.status(500).json({ message: err.message || "Server error while deleting expense" });
    }
});

module.exports = router;