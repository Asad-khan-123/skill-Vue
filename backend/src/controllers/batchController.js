import Batch from '../models/Batch.js';

export const getBatches = async (req, res) => {
  try {
    const batches = await Batch.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, batches });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const createBatch = async (req, res) => {
  try {
    const { name, classTeacher, baseFee } = req.body;
    if (!name || !classTeacher) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const newBatch = new Batch({ name, classTeacher, baseFee });
    await newBatch.save();
    res.status(201).json({ success: true, batch: newBatch });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Batch name already exists' });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
