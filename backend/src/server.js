import express from 'express';
const app = express();


app.use('/', (req, res) => {
  return res.status(200).json({message:"api is running", success: true})
})

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port  http://localhost:${PORT}/`);
})  