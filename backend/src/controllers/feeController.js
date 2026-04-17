import FeePayment from '../models/FeePayment.js';
import Student from '../models/Student.js';

export const getPendingFees = async (req, res) => {
  try {
    const { batch } = req.query;
    let query = { totalDues: { $gt: 0 } };
    if (batch && batch !== 'All') {
      query.batch = batch;
    }
    
    const students = await Student.find(query).populate('batch', 'name baseFee');
    res.status(200).json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const collectFee = async (req, res) => {
  try {
    const { studentId, amountPaid, paymentMode, remarks } = req.body;
    
    // Find the student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    if (amountPaid > student.totalDues) {
      return res.status(400).json({ success: false, message: 'Amount paid cannot exceed total dues' });
    }

    // Create payment record
    const payment = new FeePayment({
      student: studentId,
      amountPaid,
      paymentMode,
      remarks
    });
    await payment.save();

    // Deduct from total dues and increase paid amount
    student.totalDues -= amountPaid;
    student.paidAmount += amountPaid;
    await student.save();

    res.status(201).json({ success: true, payment, updatedStudent: student });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getStudentFeeLedger = async (req, res) => {
  try {
    const { id } = req.params;
    const payments = await FeePayment.find({ student: id }).sort({ datePaid: -1 });
    const student = await Student.findById(id).populate('batch', 'name classTeacher').select('name email studentId totalCourseFee paidAmount totalDues batch enrollmentDate');
    
    res.status(200).json({ 
       success: true, 
       ledger: {
          student,
          payments
       } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
