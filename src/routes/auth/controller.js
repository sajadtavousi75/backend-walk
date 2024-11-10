


const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../../models/user");
const productUserModel = require("../../models/product-user");
const registerValidator = require("./validator");

exports.register = async (req, res) => {
  const {email, username,  password} = req.body;

  const isUserExists = await userModel.findOne({
    $or: [{ username }],
  });
  
  const countOfRegisteredUser = await userModel.count();

  if (isUserExists) {
    return res.status(409).json({
      message: "username or phone is duplicate.",

    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await userModel.create({
    email,
    username,
    password: hashedPassword,
    role: countOfRegisteredUser > 0 ? "USER" : "ADMIN",
  
  });

  const userObject = user.toObject();

  Reflect.deleteProperty(userObject, "password");

  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30 day",
  });

  return res.status(201).json({ user: userObject, accessToken });
};

exports.login = async (req, res) => {
  const { identifier, password } = req.body;

  const user = await userModel.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });

  if (!user) {
    return res.status(401).json("there is no user with this email or username");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "password is not correct" });
  }

  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { 
    expiresIn: "30 day",
  });

  return res.json({ accessToken });
};

exports.getMe = async (req, res) => {
  const userProducts = await productUserModel
    .find({ user: req.user._id })
    .populate("product");

  const products = [];

  for (const userProduct of userProducts) {
    products.push(userProduct.product);
  }


  return res.json({ ...req.user, products});
};
