import Batch from '../models/Batch.js';
import Student from '../models/Student.js';
import Attendance from '../models/Attendance.js';
import FeePayment from '../models/FeePayment.js';
import ResultMatrix from '../models/ResultMatrix.js';

export const getBatches = async (req, res) => {
  try {
    const batches = await Batch.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, batches });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const createBatch = async (req, res) => {
  try {
    const { name, classTeacher, baseFee } = req.body;
    if (!name || !classTeacher) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const newBatch = new Batch({ name, classTeacher, baseFee });
    await newBatch.save();
    res.status(201).json({ success: true, batch: newBatch });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Batch name already exists' });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const deleteBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    
    // Find all students in this batch
    const students = await Student.find({ batch: batchId });
    const studentIds = students.map(s => s._id);
    
    // Delete all related records
    await Promise.all([
      Attendance.deleteMany({ 'records.student': { $in: studentIds } }),
      FeePayment.deleteMany({ student: { $in: studentIds } }),
      ResultMatrix.deleteMany({ student: { $in: studentIds } }),
      Student.deleteMany({ batch: batchId })
    ]);
    
    // Delete the batch
    const batch = await Batch.findByIdAndDelete(batchId);
    
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }
    
    res.status(200).json({ success: true, message: 'Batch and all related records deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
