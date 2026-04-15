import Student from '../models/Student.js';
import Attendance from '../models/Attendance.js';
import ResultMatrix from '../models/ResultMatrix.js';
import FeePayment from '../models/FeePayment.js';

export const getStudentPerformance = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id).populate('batch');
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    // 1. Get Attendance History (Last 30 days summary)
    const attendance = await Attendance.find({ 
       batch: student.batch._id,
       'records.student': id 
    }).limit(30);

    let presentCount = 0;
    let totalCount = 0;
    attendance.forEach(att => {
       const record = att.records.find(r => r.student.toString() === id);
       if(record && record.status !== 'holiday' && record.status !== 'none') {
          totalCount++;
          if(record.status === 'present') presentCount++;
       }
    });

    const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

    // 2. Get Result History
    const results = await ResultMatrix.find({ 
       batch: student.batch._id,
       'scores.student': id 
    }).select('examTitle subject maxMarks scores');

    const formattedResults = results.map(r => {
       const scoreRecord = r.scores.find(s => s.student.toString() === id);
       return {
          examTitle: r.examTitle,
          subject: r.subject,
          maxMarks: r.maxMarks,
          marksObtained: scoreRecord?.marksObtained || 0
       };
    });

    // 3. Last Payments
    const payments = await FeePayment.find({ student: id }).sort({ datePaid: -1 }).limit(5);

    res.status(200).json({
      success: true,
      performance: {
         student,
         attendanceRate,
         results: formattedResults,
         recentPayments: payments
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
