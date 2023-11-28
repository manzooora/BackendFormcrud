const express = require("express");
const app = express();
const cors = require("cors")
const port = 3000;
app.use(express.json());
app.use(cors())

const arr= [];
app.post('/post', (req,res)=>{
  const dataRecieve= req.body;
  console.log(dataRecieve)
  arr.push(dataRecieve)
})

app.get('/get', (req,res)=>{
  res.send(arr)
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
