import express from 'express';
const app = express()
import path from "path";
import { ENV } from './lib/env.js';
import { connectDB } from './lib/db.js'
import cors from 'cors'
import {inngest, functions} from './lib/inngest.js'
import {serve} from 'inngest/express'

const __dirname = path.resolve();

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({origin:ENV.CLIENT_URL,credentials:true}))

app.use('/api', (req, res) => {
  return res.status(200).json({ message: "api is running", success: true })
})

app.use('/api/inngest',serve({client:inngest, functions}))
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