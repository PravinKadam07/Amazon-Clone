const express = require('express');
const router = express.Router();
const UserController=require("../controller/userController");

//get the user Profile
router.get("/:userId",UserController.getUserProfile)



module.exports = router;