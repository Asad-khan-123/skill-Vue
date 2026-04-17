import express from 'express';
import { getBatches, createBatch, deleteBatch } from '../controllers/batchController.js';

const router = express.Router();

router.get('/', getBatches);
router.post('/', createBatch);
router.delete('/:batchId', deleteBatch);

export default router;
