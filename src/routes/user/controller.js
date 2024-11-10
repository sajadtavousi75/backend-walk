const userModel = require("../../models/user");
const productUserModel = require("../../models/product-user");
const savedUserModel = require("../../models/saved-user");
const bcrypt = require("bcrypt");

exports.getAll = async (req, res) => {
  const users = await userModel.find();
  
  return res.json(users);
};

exports.removeUser = async (req, res) => {
  const deletedUser = await userModel.findOneAndRemove({ _id: req.params.id });

  if (!deletedUser) {
    return res.status(404).json("There is not user");
  }

  return res.status(200).json("User Deleted Successfully");
};


exports.getUserProduct = async (req, res) => {
  const userproducts = await productUserModel
    .find({ user: req.user._id })
    .populate("product")
    .lean();

  res.json(userproducts);
};
exports.getUserSaved = async (req, res) => {
  const userSaveds = await savedUserModel
    .find({ user: req.user._id })
    .populate("product")
    .lean();

  res.json(userSaveds);
};
exports.getUserAddres = async (req, res) => {
  const userAddres = await addresUserModel
    .find({ user: req.user._id })
    // .populate("Addres")
    .lean();

  res.json(userAddres);
};

exports.productPlus = async (req,res) =>{
  const plus= await productUserModel.findOneAndUpdate(
    { _id: req.params.id },
    { $inc: { count: 1 } }, // Use the $inc operator to increment the 'count' field by 1
      { new: true } // Set 'new' option to true to get the updated document as a result
  );
  res.json(plus);
}
exports.productmin = async (req,res) =>{
  const min= await productUserModel.findOneAndUpdate(
    { _id: req.params.id },
    { $inc: { count: -1 } }, // Use the $inc operator to increment the 'count' field by 1
      { new: true } // Set 'new' option to true to get the updated document as a result
  );
  if (min.count <= 1) {
    min.count = 1;
    await min.save();
  }

  res.json(min);
}

exports.productRemove = async (req, res) => {
  const deletedProduct = await productUserModel.findOneAndRemove({
    _id: req.params.id,
  });
  return res.json(deletedProduct);
};
exports.savedRemove = async (req, res) => {
  const deletedSaved = await savedUserModel.findOneAndRemove({
    _id: req.params.id,
  });
  return res.json(deletedSaved);
};

exports.updateUser = async (req, res) => {
  const { firstname,lastname, username, password, phone } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await userModel.findOneAndUpdate(
    { _id: req.user._id },
    {
      firstname,
      lastname,
      username,
      password: hashedPassword,
      phone,
    }
  );

  return res.json(user);
};


exports.changeUserRole = async (req, res) => {
  const { role, id } = req.body;
  console.log(role);

  const user = await userModel.findByIdAndUpdate(
    { _id: id },
    {
      role: role
    }
  );

  res.json({msg: 'User role changed successfully'});
};

