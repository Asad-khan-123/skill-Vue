import express from 'express';
const app = express()
import path from "path";
import { ENV } from './lib/env.js';
import { connectDB } from './lib/db.js'

const __dirname = path.resolve();

app.use('/api', (req, res) => {
  return res.status(200).json({ message: "api is running", success: true })
})

if (ENV.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')))
}

app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'))
})

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