import Student from '../models/Student.js';
import { User } from '../models/User.js';

export const getStudents = async (req, res) => {
  try {
    const { batch } = req.query; // optional filter
    let query = {};
    if (batch && batch !== 'All') {
      query.batch = batch; // Assuming passing batch ID, or we need to lookup by name. For now, match by ID.
    }
    const students = await Student.find(query).populate('batch', 'name').sort({ createdAt: -1 });
    res.status(200).json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const createStudent = async (req, res) => {
  try {
    const { name, email, age, parentPhone, enrollmentDate, batch, totalCourseFee } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Check if email already exists
    const existingEmail = await Student.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    // Generate robust ID STU-XXXX by finding the highest one
    const lastStudent = await Student.findOne().sort({ studentId: -1 });
    let nextNum = 1001;
    if (lastStudent && lastStudent.studentId) {
       const lastNum = parseInt(lastStudent.studentId.split('-')[1]);
       if (!isNaN(lastNum)) nextNum = lastNum + 1;
    }
    const studentId = `STU-${nextNum}`;

    // Create User entry first
    const newUser = new User({
      email,
      name,
      role: 'student'
    });
    await newUser.save();

    const newStudent = new Student({
      studentId,
      email,
      name,
      age,
      parentPhone,
      enrollmentDate,
      batch,
      totalCourseFee: totalCourseFee || 0,
      paidAmount: 0,
      totalDues: totalCourseFee || 0,
      status: 'Active'
    });
    
    await newStudent.save();
    res.status(201).json({ success: true, student: newStudent });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getStudentStats = async (req, res) => {
   try {
      const total = await Student.countDocuments();
      const active = await Student.countDocuments({ status: 'Active' });
      res.status(200).json({ success: true, stats: { total, active } });
   } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
   }
};

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Cleanup fee payments
    await import('../models/FeePayment.js').then(m => m.default.deleteMany({ student: id }));
    
    res.status(200).json({ success: true, message: 'Student and related records deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
