import express from 'express';
import { getBatches, createBatch } from '../controllers/batchController.js';

const router = express.Router();

router.get('/', getBatches);
router.post('/', createBatch);

export default router;
