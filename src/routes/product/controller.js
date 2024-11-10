
const productModel = require("../../models/product");
const commentModel = require("../../models/comment");
const productUserModel = require("../../models/product-user");
const productSavedModel = require("../../models/saved-user");

const fs = require('fs');
const path = require('path');

exports.create = async (req, res) => {
  // در کنترلر create:
const { name, description, shortName, categoryID, genderID, discount,price,size } = req.body; 

const allCover1=[]
const allCover2=[]
const allCover3=[]
 
if(req.files && req.files.cover1){

  req.files.cover1.forEach((data)=>{
    console.log(data.filename)
    allCover1.push(data.filename)
  })
}

if(req.files && req.files.cover2){

  req.files.cover2.forEach((data)=>{
    console.log(data.filename)
    allCover2.push(data.filename)
  })
}

if(req.files && req.files.cover3){

  req.files.cover3.forEach((data)=>{
    console.log(data.filename)
    allCover3.push(data.filename)
  })
}



const product = await productModel.create({
  name,
  description,
  shortName,
  categoryID,
  genderID,
  price,
  size,
  discount: Boolean(discount) === true ? discount : 0,
  cover1: allCover1,
  cover2: allCover2,
  cover3: allCover3,
});


  const populatedProduct = await productModel
    .findById(product._id)
    // .populate("categoryID","-password");

  return res.status(201).json(populatedProduct);
};

exports.getAll = async (req, res) => {
  const products = await productModel
    .find()
    .populate("categoryID")
    .populate("genderID")
    .lean()
    .sort({ _id: -1 });

  const registers = await productUserModel.find({}).lean();
  const getAllSaved = await productSavedModel.find({}).lean();
  const comments = await commentModel.find().lean();

  let allProducts = [];

  products.forEach((product) => {
    let productTotalScore = 5;
    let productRegisters = registers.filter(
      (register) => register.product.toString() === product._id.toString()
    );

    let productScores = comments.filter(
      (comment) => comment.product.toString() === product._id.toString()
    );

    productScores.forEach((comment) => {
      productTotalScore += Number(comment.score);
    });

    allProducts.push({
      ...product,
      categoryID: product.categoryID.title,
      registers: productRegisters.length,
      saved: getAllSaved,
      productAverageScore: Math.floor(
        productTotalScore / (productScores.length + 1)
      ),
    });
  });

  return res.json(allProducts);
};

exports.getOne = async (req, res) => {
  const product = await productModel
    .findOne({ shortName: req.params.shortName })
    .populate("categoryID", "-password")
    .populate("genderID")
    .lean();

  if(product){
    const comments = await commentModel
    .find({ product: product._id, answer: 1 })
    .populate("creator") 
    .lean();

  
  

  let isUserRegisteredToThisProduct = null;
  if (req.user) {
    isUserRegisteredToThisProduct = !!(await productUserModel.findOne({
      user: req.user._id,
      product: product._id,
    }));
  } else {
    isUserRegisteredToThisProduct = false;
  }

  let allComments = [];

  comments.forEach((comment) => {
    let mainCommentAnswerInfo = null;
    comments.forEach((answerComment) => {
      if (String(comment._id) == String(answerComment.mainCommendID)) {
        mainCommentAnswerInfo = { ...answerComment };
      }
    });
    if (!comment.mainCommendID) {
      allComments.push({
        ...comment,
        product: comment.product.name,
        answerContent: mainCommentAnswerInfo,
      });
    }
  });

  return res.json({
    ...product,
    comments: allComments,
    isUserRegisteredToThisProduct,
  });
  }else{
    return res.status(403).json({message: 'product is available'})
  }
};


exports.register = async (req, res) => {
  const isUserAlreadyRegistered = await productUserModel
    .findOne({ user: req.user._id, product: req.params.id })
    .lean();

  if (isUserAlreadyRegistered) {
    res.status(409).json({message: 'product is available in the basket'})
  }else{

    await productUserModel.create({
      user: req.user._id,
      product: req.params.id,
      count: req.body.count
    });
  
    return res.status(201).json({ message: "you are add to basket successfully." });
  }
};
exports.saved = async (req, res) => {
  const isProductSaved = await productSavedModel
    .findOne({ user: req.user._id, product: req.params.id })
    .lean();

  if (isProductSaved) {
    return res
      .status(409)
      .json({ message: "you are already product saved" });
  }

    
  await productSavedModel.create({
    user: req.user._id,
    product: req.params.id,
  });

  return res.status(201).json({ message: "you are add to saved product." });
};



exports.getCategoryProduct = async (req, res) => {
  const { categoryName , gender } = req.params;
  

  let allProducts=[]

  if(categoryName==='ALL' && gender==='ALL'){
    const products = await productModel
    .find()
    .lean()
    .sort({ _id: -1 });

    if(products.length){

      allProducts.push(products)
    }
  }else if(categoryName==='ALL'&& gender==='MEN'){
    const products = await productModel.find({
      genderID: gender,
        })

        if(products.length){

          allProducts.push(products)
        }
  }else  if(categoryName==='ALL' && gender==='WOMEN'){
    const products = await productModel.find({
      genderID: gender,
        })

        if(products.length){

          allProducts.push(products)
        }
  }else if(categoryName ==='lifestyle' &&  gender==='ALL'){
    const products = await productModel.find({
      categoryID: categoryName,
        })

        if(products.length){

          allProducts.push(products)
        }
  }else if(categoryName ==='lifestyle' &&  gender==='MEN'){
    const products = await productModel.find({
      categoryID: categoryName,
      genderID:gender
        })

        if(products.length){

          allProducts.push(products)
        }
  }else if(categoryName ==='lifestyle' &&  gender==='WOMEN'){
    const products = await productModel.find({
      categoryID: categoryName,
      genderID:gender
        })

        if(products.length){

          allProducts.push(products)
        }
  }else if(categoryName ==='running' &&  gender==='ALL'){
    const products = await productModel.find({
      categoryID: categoryName,
        })

        if(products.length){

          allProducts.push(products)
        }
  }else if(categoryName ==='running' &&  gender==='MEN'){
    const products = await productModel.find({
      categoryID: categoryName,
      genderID:gender
        })

        if(products.length){

          allProducts.push(products)
        }
  }else if(categoryName ==='running' &&  gender==='WOMEN'){
    const products = await productModel.find({
      categoryID: categoryName,
      genderID:gender
        })

        if(products.length){

          allProducts.push(products)
        }
  }else if(categoryName ==='football' &&  gender==='ALL'){
    const products = await productModel.find({
      categoryID: categoryName,
        })

        if(products.length){

          allProducts.push(products)
        }
  }else if(categoryName ==='football' &&  gender==='MEN'){
    const products = await productModel.find({
      categoryID: categoryName,
      genderID:gender
        })

        if(products.length){

          allProducts.push(products)
        }
  }else if(categoryName ==='football' &&  gender==='WOMEN'){
    const products = await productModel.find({
      categoryID: categoryName,
      genderID:gender
        })

        if(products.length){

          allProducts.push(products)
        }
  }

  // if(categoryName === "ALL"){
  //   const products = await productModel
  //   .find()
  //   .lean()
  //   .sort({ _id: -1 });

  //   if(products.length){

  //     allProducts.push(products)
  //   }
  // }else{
  //   const categoryProducts = await productModel.find({
  //     categoryID: categoryName,
  //       })

  //       if(categoryProducts.length){

  //         allProducts.push(categoryProducts)
  //       }
  // }


  // if(gender === "ALL"){
  //   const products1 = await productModel
  //   .find()
  //   .lean()
  //   .sort({ _id: -1 });

  //   if(products1.length){

  //     allProducts.push(products1)
  //   }
  // }else{
  //   const genderProducts = await productModel.find({
  //     genderID: gender,
  //       })

  //       if(genderProducts.length){

  //         allProducts.push(genderProducts)
  //       }
  // }

  res.json(allProducts)
  // const category = await subCategoryModel.find({ title: categoryName });
  // if (category.length) {
  //   const categoryProducts = await productModel.find({
  //     subcategoryID: category[0]._id,
  //   })
  //   .populate("authorID");
  //   res.json(categoryProducts);
  // } else {
  //   res.json([]);
  // }
};

exports.remove = async (req, res) => {
  const deletedProduct = await productModel.findOneAndRemove({
    _id: req.params.id,
  });
  if (!deletedProduct) {
    return res.status(404).json({ message: "product Not Found!" });
  }
  return res.json(deletedCourse);

};

exports.updatedDiscount= async(req,res) =>{
  const {discount} = req.body

  const discountUpdate = await productModel.findOneAndUpdate(
    {_id: req.params.id},
    {discount:discount},
    {new: true}
  )
  res.json(discountUpdate)

}




