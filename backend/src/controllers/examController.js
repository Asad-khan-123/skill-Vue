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
