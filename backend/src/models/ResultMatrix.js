import mongoose from 'mongoose';

const resultMatrixSchema = new mongoose.Schema({
  examTitle: {
    type: String,
    required: true
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  maxMarks: {
    type: Number,
    required: true,
    default: 100
  },
  date: {
    type: Date,
    default: Date.now
  },
  scores: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    marksObtained: {
      type: Number,
      required: true
    }
  }]
}, { timestamps: true });

export default mongoose.model('ResultMatrix', resultMatrixSchema);
