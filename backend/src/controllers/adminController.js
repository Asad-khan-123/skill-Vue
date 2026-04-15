import Student from '../models/Student.js';
import Batch from '../models/Batch.js';
import FeePayment from '../models/FeePayment.js';
import Attendance from '../models/Attendance.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    
    // Calculate total fees collected this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const monthlyPayments = await FeePayment.aggregate([
      { $match: { datePaid: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amountPaid' } } }
    ]);
    const totalFeesCollected = monthlyPayments.length > 0 ? monthlyPayments[0].total : 0;

    // Get today's attendance percentage
    const today = new Date().toISOString().split('T')[0]; // simple YYYY-MM-DD
    const attendanceRecords = await Attendance.find({ date: today });
    
    let totalPresent = 0;
    let totalMarked = 0;
    
    attendanceRecords.forEach(att => {
      att.records.forEach(r => {
        if (r.status !== 'none' && r.status !== 'holiday') {
          totalMarked++;
          if (r.status === 'present') totalPresent++;
        }
      });
    });

    const attendancePercentage = totalMarked > 0 ? Math.round((totalPresent / totalMarked) * 100) : 0;

    // Default batches for health overview
    const batchesData = await Batch.find().lean();
    for (let batch of batchesData) {
      batch.strength = await Student.countDocuments({ batch: batch._id });
      // Stub attendance for the batch if missing
      batch.attendance = "N/A";
    }

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalFeesCollected,
        attendancePercentage,
        todayPresent: totalPresent,
        todayMarked: totalMarked
      },
      batches: batchesData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
