import { getBatchAttendance, saveBatchAttendance, getAttendanceHistory } from '../controllers/attendanceController.js';
import express from 'express';

const router = express.Router();

router.get('/batch', getBatchAttendance);
router.post('/batch', saveBatchAttendance);
router.get('/history', getAttendanceHistory);

export default router;
