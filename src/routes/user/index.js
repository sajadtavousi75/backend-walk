const express = require("express");

const userController = require("./controller");
const isAdminMiddleware = require("../../middlewares/isAdmin");
const isAuthenticated = require("../../middlewares/authenticated");

const router = express.Router();


router
  .route("/")
  .get(isAuthenticated, isAdminMiddleware, userController.getAll)
  .put(isAuthenticated, userController.updateUser);

router
  .route("/:id")
  .delete(isAuthenticated, isAdminMiddleware, userController.removeUser);


router.route("/products").get(isAuthenticated, userController.getUserProduct);
router.route("/saved").get(isAuthenticated, userController.getUserSaved);
router.route("/addres").get(isAuthenticated, userController.getUserAddres);
router.route("/products/plus/:id").put(isAuthenticated, userController.productPlus);
router.route("/products/min/:id").put(isAuthenticated, userController.productmin);
router.route("/products/:id").delete(isAuthenticated, userController.productRemove);
router.route("/saved/:id").delete(isAuthenticated, userController.savedRemove);
// router.route("/role").put(isAuthenticated, isAdminMiddleware, userController.changeUserRole);

module.exports = router;