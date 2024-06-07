const mongoose = require('mongoose');

async function connectDB() {

    mongoose.connect(
        "mongodb+srv://PravinKadam:root@cluster0.7w3wyu5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
      ).then(
          ()=>{
              console.log("connected to mongoDB")
          }
      ).catch((err)=>{
        console.log("error connected to mongodb :",err)
      })
      
}

module.exports = connectDB;