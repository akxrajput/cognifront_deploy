const express = require('express');
const app = express();

const mongoose = require('mongoose');

const port = 3000;

app.use(express.json());
app.get('/images' , async (req ,res) =>{
   
})


app.listen(port , ()=>{
    console.log(`server is running on ${port}`);
})

