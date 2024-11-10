// const express = require('express');
// const router = express.Router();
// const controller = require('./controller');
// const {isLoggined , isAdmin} = require('../../middlewares/auth')

// router
//   .route("/")
//   .post(isLoggined,isAdmin, controller.create)
//   .get(controller.getAll);

// router
//   .route("/:id")
//   .delete(isLoggined,isAdmin, controller.remove)
//   .put(isLoggined,isAdmin, controller.update);

// module.exports = router;


const express = require('express');
const router = express.Router();
const controller = require('./controller');
const isAdminMiddleware = require("../../middlewares/isAdmin");
const authenticatedMiddleware = require("../../middlewares/authenticated");

router
  .route("/")
  .post(authenticatedMiddleware,isAdminMiddleware, controller.create)
  .get(controller.getAll);

router
  .route("/:id")
  .delete(authenticatedMiddleware,isAdminMiddleware, controller.remove)

module.exports = router;