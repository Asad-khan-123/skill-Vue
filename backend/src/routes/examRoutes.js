import express from 'express';
import { getResultsMatrix, saveResultsMatrix } from '../controllers/examController.js';

const router = express.Router();

router.get('/marks', getResultsMatrix);
router.post('/marks', saveResultsMatrix);

export default router;
