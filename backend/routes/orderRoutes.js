const express = require('express');
const router = express.Router();
const UserController=require("../controller/userController");


//endpoint to store all orders
router.post("/",UserController.storeAllOrders);

//endpoint get order by id
router.get("/:userId",UserController.getOrderById)

module.exports = router;