import { getPendingFees, collectFee, getStudentFeeLedger } from '../controllers/feeController.js';
import express from 'express';

const router = express.Router();

router.get('/pending', getPendingFees);
router.post('/collect', collectFee);
router.get('/student/:id', getStudentFeeLedger);

export default router;
