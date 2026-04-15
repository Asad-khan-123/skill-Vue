import express from 'express';
import { getStudents, createStudent, deleteStudent, getStudentStats } from '../controllers/studentController.js';
import { getStudentPerformance } from '../controllers/studentStatsController.js';

const router = express.Router();

router.get('/dashboard-stats', getStudentStats);
router.get('/', getStudents);
router.post('/', createStudent);
router.delete('/:id', deleteStudent);
router.get('/performance/:id', getStudentPerformance);

export default router;
