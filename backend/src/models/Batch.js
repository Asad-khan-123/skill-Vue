import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  classTeacher: {
    type: String, // String for simplicity, or ref to User if teachers log in
    required: true
  },
  baseFee: {
    type: Number,
    required: true,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model('Batch', batchSchema);
