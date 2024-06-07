const express = require('express');
const router = express.Router();
const UserController=require("../controller/userController");

//endpoint to add adresses
router.post("/",UserController.addAddresses);

//endpoint to get addresses
router.get("/:userId",UserController.allAddresses)

module.exports = router;