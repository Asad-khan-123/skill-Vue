import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';

export const getBatchAttendance = async (req, res) => {
  try {
    const { batch, date } = req.query;
    if (!batch || !date) {
      return res.status(400).json({ success: false, message: 'Batch ID and Date are required' });
    }

    let attendance = await Attendance.findOne({ batch, date }).populate('records.student', 'name studentId');
    
    // If no attendance record exists for this date, generate a blank one using the active students in that batch
    if (!attendance) {
      const students = await Student.find({ batch, status: 'Active' }).select('name studentId');
      const records = students.map(student => ({
        student: {
          _id: student._id,
          name: student.name,
          studentId: student.studentId
        },
        status: 'none',
      }));
      return res.status(200).json({ success: true, records, isNewDay: true });
    }

    res.status(200).json({ success: true, records: attendance.records, isNewDay: false });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const saveBatchAttendance = async (req, res) => {
  try {
    const { batch, date, records } = req.body;
    if (!batch || !date || !records) {
      return res.status(400).json({ success: false, message: 'Batch, date, and records are required' });
    }

    // Upsert the record
    const attendance = await Attendance.findOneAndUpdate(
      { batch, date },
      { batch, date, records },
      { new: true, upsert: true } // Create if doesn't exist
    );

    res.status(200).json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getAttendanceHistory = async (req, res) => {
  try {
    const { batch } = req.query;
    if (!batch) {
       return res.status(400).json({ success: false, message: 'Batch ID is required' });
    }
    const history = await Attendance.find({ batch }).sort({ date: -1 });
    res.status(200).json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
