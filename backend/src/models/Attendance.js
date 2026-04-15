import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    required: true
  },
  records: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'holiday', 'none'],
      default: 'none'
    }
  }]
}, { timestamps: true });

// Optimize query for given date + batch
attendanceSchema.index({ date: 1, batch: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);
