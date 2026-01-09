const express=require('express');
app=express();
const path = require('path');
const db=require('./db');
const bodyParser=require('body-parser');
app.use(bodyParser.json());
require('dotenv').config();
const cors = require('cors');
app.use(cors());

app.use(express.static(path.join(__dirname, 'Frontend')));
const reviewroutes=require('./routes/review_routes');
app.use('/review',reviewroutes);
// Catch-all route to serve the index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'index.html'));
});


// Serve the index.html file for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend', 'index.html'));
});


const PORT=process.env.PORT||3000;
app.listen(PORT,()=>{
    console.log(`listening on ${PORT}`);
})
