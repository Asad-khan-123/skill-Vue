import express from 'express';
import { getResultsMatrix, saveResultsMatrix, getExams, createExam, addStudentMarks, getBatchStudents, getStudentResults } from '../controllers/examController.js';

const router = express.Router();

router.get('/student-results', getStudentResults);
router.get('/batch-students', getBatchStudents);
router.get('/marks', getResultsMatrix);
router.post('/marks', saveResultsMatrix);
router.post('/student-marks', addStudentMarks);
router.get('/', getExams);
router.post('/', createExam);

export default router;

