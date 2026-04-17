import ResultMatrix from '../models/ResultMatrix.js';
import Student from '../models/Student.js';

export const getResultsMatrix = async (req, res) => {
  try {
    const { batch, examTitle, subject } = req.query;
    
    // First, try to find an existing Matrix
    const existingMatrix = await ResultMatrix.findOne({ batch, examTitle, subject }).populate('scores.student', 'name studentId');
    
    if (existingMatrix) {
      return res.status(200).json({ success: true, matrix: existingMatrix });
    }

    // If it doesn't exist, we send back a blank matrix with the students initialized
    const students = await Student.find({ batch, status: 'Active' });
    const templateScores = students.map(student => ({
      student: student, // Returning whole object temporarily for UI reference
      marksObtained: ""
    }));

    return res.status(200).json({ 
      success: true, 
      isNew: true, 
      matrix: { examTitle, subject, batch, maxMarks: 100, scores: templateScores } 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const saveResultsMatrix = async (req, res) => {
  try {
    const { examTitle, batch, subject, maxMarks, scores } = req.body;
    
    if (!examTitle || !batch || !subject || !scores) {
      return res.status(400).json({ success: false, message: 'Missing required exam fields' });
    }

    // Upsert the whole matrix for the batch
    const matrix = await ResultMatrix.findOneAndUpdate(
      { examTitle, batch, subject },
      { examTitle, batch, subject, maxMarks, scores },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, matrix });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getExams = async (req, res) => {
  try {
    const { batch } = req.query;
    let query = {};
    if (batch) {
      query.batch = batch;
    }
    const exams = await ResultMatrix.find(query).populate('batch', 'name').sort({ date: -1 });
    res.status(200).json({ success: true, exams });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const createExam = async (req, res) => {
  try {
    const { examTitle, batch, subject, chapter, date, timing, maxMarks } = req.body;
    
    if (!examTitle || !batch || !subject || !chapter || !date || !timing) {
      return res.status(400).json({ success: false, message: 'Missing required exam fields' });
    }

    const exam = new ResultMatrix({
      examTitle,
      batch,
      subject,
      chapter,
      date: new Date(date),
      timing,
      maxMarks: maxMarks || 100,
      scores: []
    });

    await exam.save();
    res.status(201).json({ success: true, exam });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const addStudentMarks = async (req, res) => {
  try {
    const { examId, studentId, marksObtained } = req.body;
    
    if (!examId || !studentId || marksObtained === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const exam = await ResultMatrix.findById(examId);
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    // Find if student already has marks
    const scoreIndex = exam.scores.findIndex(s => s.student.toString() === studentId);
    
    if (scoreIndex > -1) {
      // Update existing marks
      exam.scores[scoreIndex].marksObtained = marksObtained;
    } else {
      // Add new marks
      exam.scores.push({ student: studentId, marksObtained });
    }

    await exam.save();
    const updatedExam = await ResultMatrix.findById(examId).populate('scores.student', 'name studentId');
    
    res.status(200).json({ success: true, exam: updatedExam });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getBatchStudents = async (req, res) => {
  try {
    const { batchId } = req.query;
    if (!batchId) {
      return res.status(400).json({ success: false, message: 'Batch ID required' });
    }

    const students = await Student.find({ batch: batchId, status: 'Active' }).sort({ name: 1 });
    res.status(200).json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
