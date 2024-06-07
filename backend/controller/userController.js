const User = require("../models/user");
const Order = require("../models/Order")
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const {
  sendVerificationEmail,
  generateSecrateKey,
} = require("../middleware/utilFunctions");
const { use } = require("../routes/userRegisterRoutes");

const secretKey = generateSecrateKey();
//-------------------- creating new user -------------------------------------------

exports.createUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const existingUser = await User.findOne({ email });

    //check email is already registered
    if (existingUser) {
      return res.status(400).json({ message: "email is already registered" });
    }
    //create new user
    const newUser = new User({ email, name, password });
    //generate and store varification token
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");
    //save newuser to database
    await newUser.save();

    //send verification email to user
    sendVerificationEmail(newUser.email, newUser.verificationToken);
    res.status(200).json({ message: "user registerd" });
  } catch (error) {
    console.log("error registring User:", error);
    res.status(500).json({ message: "Registration Failed" });
  }
};

//-------------------------for verfily email-------------------------------------
exports.emailVerify = async (req, res) => {
  try {
    const token = req.params.token;

    //find the user with the given token verification token
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "invalid verification token" });
    }
    user.verified = true;
    user.verificationToken = undefined;
    await user.save();
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Email verification Failed!" });
  }
};

//-------------------endpoint for login user--------------------------------------

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("email",email)
    //check if the user is exists
    const user = await User.findOne({ email });
    console.log("user",user)
    if (!user) {
      return res.status(401).json({ message: "invalid email or password" });
    }

    //check if the password is correct
    if (user.password != password) {
      return res.status(401).json({ message: "invalid password" });
    }

    // generate token
    const token = jwt.sign({ userId: user._id }, secretKey);
   res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "login failed" });
  }
};

//---------------------- endpoint for store the new address ----------------------------------------------

exports.addAddresses = async (req, res) => {
  try {
    const { userId, address } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.addresses.push(address);

    await user.save();
    res.status(200).json({ message: "Address created Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding address" });
  }
};

//---------------------- endpoint for get all addresses--------------------------------------------

exports.allAddresses = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User Not found" });
    }
    const addresses = await user.addresses;

    res.status(200).json({ addresses });
  } catch (error) {
    res.status(500).json({ message: "Error retrieveing the addresses" });
  }
};

//--------------------------- endpoint to store all orders ------------------------------------------

exports.storeAllOrders = async (req, res) => {
  try {
    const { userId, cartItems, totalPrice, shippingAddress, paymentMethod } =  req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const products = cartItems.map((item) => ({
      name: item?.title,
      quantity: item?.quantity,
      price: item.price,
      image: item?.image,
    }));

    const order = new Order({
      user: userId,
      products: products,
      totalPrice: totalPrice,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
    });

    await order.save();

    user.orders.push(order._id);
    await user.save();

    res.status(200).json({ message: "order created successfully !" });
  } catch (error) {
    console.log("error creating orders", error);
    res.status(500).json({ message: "Error creating orders" });
  }
};
//-------------------------- endpoint get order by id ---------------------------------------------------------

exports.getOrderById = async (req, res) => {
  try {
  //  console.log("im called")
    const userId=req.params.userId;
    const orders=await Order.find({user:userId}).populate("user");
   
    if(!orders || orders.length===0){
      return res.status(404).json({message:"no orders found for the users"})
    }

    return res.status(200).json({orders})
  } catch (error) {
    console.log("error creating orders", error);
    res.status(500).json({ message: "Error creating orders" });
  }
};



//---------------------------endpoint to get user profile-------------------------------------------------------

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
   
    if (!user) {
     return res.status(404).json({ message: "user not found!" });
    }

    res.status(200).json({ user }); 
  } catch (error) {
    res.status(500).json({ message: "Error retriving the user Profile " });
  }
};
