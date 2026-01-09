const mongoose=require('mongoose');
require('dotenv').config();
const mongo_atlas=process.env.DB_URL;
const mongo_url_local=process.env.DB_URL_LOCAL;

mongoose.connect(mongo_atlas, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })

const db=mongoose.connection;

db.on('connected',()=>{
    console.log("mongodb server is connected");
})

db.on('error',(error)=>{
    console.error("mongodb error occured:"+error);
})

db.on('disconnected',()=>{
    console.log("mongodob is disconnected");
})

module.exports={
    db
}