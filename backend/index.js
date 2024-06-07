const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const connectDB=require("./connection/DB")
const port = 8000;
const cors = require("cors");
app.use(cors());
const userRegisterRoutes=require("./routes/userRegisterRoutes");
const userLoginRoutes=require("./routes/userLoginRoutes");
const addressRoutes = require("./routes/addressRoutes");
const orderRoutes=require("./routes/orderRoutes")
const profileRoutes=require("./routes/profileRoutes")

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


connectDB();

app.use("/register",userRegisterRoutes);
app.use("/login",userLoginRoutes);
app.use("/addresses",addressRoutes);
app.use("/orders",orderRoutes);
app.use("/profile",profileRoutes)

app.listen(port,()=>{
console.log("server running on port 8000")
})
