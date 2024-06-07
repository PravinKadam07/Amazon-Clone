const express = require('express');
const router = express.Router();
const UserController=require("../controller/userController");

//endpoint to login user
router.post("/",UserController.loginUser);

module.exports = router;