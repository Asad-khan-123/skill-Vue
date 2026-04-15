import mongoose from 'mongoose';

const feePaymentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  amountPaid: {
    type: Number,
    required: true
  },
  paymentMode: {
    type: String,
    enum: ['Cash', 'UPI', 'Online'],
    default: 'Cash'
  },
  remarks: {
    type: String,
    default: ''
  },
  datePaid: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model('FeePayment', feePaymentSchema);
