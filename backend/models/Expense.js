const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    tripId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Trip', 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    category: { 
        type: String, 
        default: 'General' 
    },
    paidBy: { 
        type: String, 
        default: 'You' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);