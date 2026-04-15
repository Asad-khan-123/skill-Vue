import express from 'express';
const app = express()
import path from "path";
import { ENV } from './lib/env.js';
import { connectDB } from './lib/db.js'
import cors from 'cors'
import { googleLogin } from './controllers/authController.js';
import batchRoutes from './routes/batchRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import feeRoutes from './routes/feeRoutes.js';
import examRoutes from './routes/examRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const __dirname = path.resolve();

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({origin:ENV.CLIENT_URL,
  credentials:true}))

app.post('/api/auth/google', googleLogin);
app.use('/api/batches', batchRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/admin', adminRoutes);



if (ENV.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}


const PORT = ENV.PORT

const startServer = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`Server is running on port  http://localhost:${PORT}/`);
    })
  } catch (error) {
    console.log(error)
  }
}

startServer()