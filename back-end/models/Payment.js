const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    amount: { type: Number },
    paymentStatus: { type: String, enum: ['pending', 'successful', 'failed'] }
  });

module.exports = mongoose.model('Payment', paymentSchema);

