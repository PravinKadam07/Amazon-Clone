const express = require('express');
const router = express.Router();
const UserController=require("../controller/userController");
//endpoint to create user
router.post("/",UserController.createUser);

//endpoint to verify email
router.get("/verify/:token",UserController.emailVerify)
module.exports = router;