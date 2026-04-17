import express from 'express';
import { getResultsMatrix, saveResultsMatrix, getExams, createExam, addStudentMarks, getBatchStudents } from '../controllers/examController.js';

const router = express.Router();

router.get('/', getExams);
router.get('/batch-students', getBatchStudents);
router.get('/marks', getResultsMatrix);
router.post('/marks', saveResultsMatrix);
router.post('/student-marks', addStudentMarks);
router.post('/', createExam);

export default router;
