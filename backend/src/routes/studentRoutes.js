import express from 'express';
import { getStudents, createStudent, deleteStudent, getStudentStats, getStudentByUserId } from '../controllers/studentController.js';
import { getStudentPerformance } from '../controllers/studentStatsController.js';

const router = express.Router();

router.get('/dashboard-stats', getStudentStats);
router.get('/user/:userId', getStudentByUserId);
router.get('/', getStudents);
router.post('/', createStudent);
router.delete('/:id', deleteStudent);
router.get('/performance/:id', getStudentPerformance);

export default router;
