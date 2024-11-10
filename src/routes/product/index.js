// const express = require('express');
// const multer = require("multer");
// const router = express.Router();
// const controller = require('./controller');
// const multerStorage = require("../../util/multerStorage");
// const {isLoggined , isAdmin} = require('../../middlewares/auth')

// router
//   .route("/")
//   .post(
//     multer({ storage: multerStorage, limits: { fileSize: 1000000000 } }).single(
//       "cover"
//     ),
//     isLoggined,
//     isAdmin,
//     controller.create
//   )
//   .get(controller.getAll);

// router.route("/:id").delete(controller.remove);



// router.route("/:shortName").post(isLoggined, controller.getOne);

// router
//   .route("/:id/register")
//   .post(isLoggined, controller.register);

// router
//   .route("/category/:categoryName")
//   .get(controller.getCategoryProduct);

// module.exports = router;




// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const crypto = require('crypto');
// const router = express.Router();
// const controller = require('./controller');
// const { isLoggined, isAdmin } = require('../../middlewares/auth');

// // تنظیمات multer برای Product
// const productMulterStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname,'..', '..', 'public', 'products', 'covers'));
//   },
//   filename: (req, file, cb) => {
//     const sha256 = crypto.createHash('SHA256');
//     const hashedFileName = sha256.update(file.originalname).digest('hex');
//     cb(null, hashedFileName + path.extname(file.originalname));
//   },
// });
// const productMulter = multer({ storage: productMulterStorage, limits: { fileSize: 1000000000 } });

// // تنظیمات multer برای Printed
// const printedMulterStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname,'..', '..', 'public', 'printed', 'covers'));
//   },
//   filename: (req, file, cb) => {
//     const sha256 = crypto.createHash('SHA256');
//     const hashedFileName = sha256.update(file.originalname).digest('hex');
//     cb(null, hashedFileName + path.extname(file.originalname));
//   },
// });
// const printedMulter = multer({ storage: printedMulterStorage, limits: { fileSize: 1000000000 } });

// router
//   .route("/")
//   .post(
//     (req, res, next) => {
//       productMulter.single("cover")(req, res, (err) => {
//         if (err) {
//           return next(err);
//         }
//         printedMulter.single("cover")(req, res, next);
//       });
//     },
//     isLoggined,
//     isAdmin,
//     controller.create
//   )
//   .get(controller.getAll);

// router.route("/:id").delete(controller.remove);

// router.route("/:shortName").post(isLoggined, controller.getOne);

// router
//   .route("/:id/register")
//   .post(isLoggined, controller.register);

// router
//   .route("/category/:categoryName")
//   .get(controller.getCategoryProduct);

// module.exports = router;




const express = require('express');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const router = express.Router();
const controller = require('./controller');
const multerStorage = require("../../util/multerStorage");
const isAdminMiddleware = require("../../middlewares/isAdmin");
const authenticatedMiddleware = require("../../middlewares/authenticated");

// تنظیمات برای آپلود فایل‌ها
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'products', 'covers'));
  },
  filename: (req, file, cb) => {
    const sha256 = crypto.createHash('SHA256');
    const hashedFileName = sha256.update(file.originalname).digest('hex');
    cb(null, hashedFileName + path.extname(file.originalname));
  },
});  

// تعریف توابع آپلود برای هر فیلد
const uploadFileDigital = multer({ storage: multerStorage, limits: { fileSize: 1000000000 }  }).single("fileDigital");
const uploadFileAudio = multer({ storage: multerStorage, limits: { fileSize: 1000000000 }  }).single("fileAudio");
const uploadCover = multer({ storage: multerStorage, limits: { fileSize: 1000000000 }  }).single("cover"); 

const upload = multer({
  storage: multerStorage,
  limits: { fileSize: 1000000000 }
});

router
  .route("/")
  .post(
    upload.fields([
      { name: 'cover1', maxCount: 3 },
      { name: 'cover2', maxCount: 3 },
      { name: 'cover3', maxCount: 2 }
    ]),
    // authenticatedMiddleware,
    // isAdminMiddleware,
    controller.create
  )
  .get(controller.getAll);

  router.route("/:id").delete(controller.remove);

  router.route("/:shortName").post( controller.getOne);
  
  router
    .route("/:id/register")
    .post(authenticatedMiddleware, controller.register);
  router
    .route("/:id/saved")
    .post(authenticatedMiddleware, controller.saved);
  router
    .route("/:id/discount")
    .put( authenticatedMiddleware,isAdminMiddleware, controller.updatedDiscount);

  router
    .route("/category/:categoryName/gender/:gender")
    .get(controller.getCategoryProduct);

module.exports = router;

