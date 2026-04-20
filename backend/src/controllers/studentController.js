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

    // Validate email format (RFC 5322 simplified)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format. Please ensure it is a valid email address.' });
    }

    // Check if email already exists in Student collection
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ success: false, message: 'Email already exists in Student records' });
    }

    // Check if email already exists in User collection
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered in the system. This user may have logged in before.' });
    }

    // Generate robust ID STU-XXXX by finding the highest one
    const lastStudent = await Student.findOne().sort({ studentId: -1 });
    let nextNum = 1001;
    if (lastStudent && lastStudent.studentId) {
       const lastNum = parseInt(lastStudent.studentId.split('-')[1]);
       if (!isNaN(lastNum)) nextNum = lastNum + 1;
    }
    const studentId = `STU-${nextNum}`;

    // Create User entry first (with lower-case email for consistency)
    const newUser = new User({
      email: email.toLowerCase(),
      name,
      role: 'student'
    });
    await newUser.save();

    const newStudent = new Student({
      userId: newUser._id,
      studentId,
      email: email.toLowerCase(),
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
    res.status(201).json({ success: true, student: newStudent, message: 'Student created successfully. They can now login with their email on Google.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getStudentByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const student = await Student.findOne({ userId })
      .populate('batch', 'name classTeacher baseFee')
      .populate('userId', 'email name profilePicture');
    
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found' });
    }
    
    res.status(200).json({ success: true, student });
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
    
    // Get the student first to retrieve their userId and email
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const userId = student.userId;
    const studentEmail = student.email;

    // Delete from User collection by userId (primary relationship)
    await User.deleteOne({ _id: userId });

    // Cleanup fee payments
    await import('../models/FeePayment.js').then(m => m.default.deleteMany({ student: id }));

    // Cleanup attendance records (remove student from records array)
    const Attendance = (await import('../models/Attendance.js')).default;
    await Attendance.updateMany(
      { 'records.student': id },
      { $pull: { records: { student: id } } }
    );

    // Cleanup result matrix records (remove student from scores array)
    const ResultMatrix = (await import('../models/ResultMatrix.js')).default;
    await ResultMatrix.updateMany(
      { 'scores.student': id },
      { $pull: { scores: { student: id } } }
    );

    // Finally delete the student
    await Student.findByIdAndDelete(id);
    
    res.status(200).json({ success: true, message: 'Student and all related records deleted successfully from all collections' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
