const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
  destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination' },
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  budget: { type: Number, required: true },
  members: [{ type: String }],
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);