const express = require('express');
const router = express.Router();
const controller = require('./controller');
const isAdminMiddleware = require("../../middlewares/isAdmin");
const authenticatedMiddleware = require("../../middlewares/authenticated");

router
  .route("/")
  .post(authenticatedMiddleware, controller.create)
  .get(controller.getAll);

router
  .route("/:id")
  .delete(authenticatedMiddleware, isAdminMiddleware, controller.remove);

router
  .route("/answer/:id")
  .post(authenticatedMiddleware, isAdminMiddleware, controller.answer);

router
  .route("/accept/:id")
  .put(authenticatedMiddleware, isAdminMiddleware, controller.accept);

  router
  .route("/reject/:id")
  .put(authenticatedMiddleware, isAdminMiddleware, controller.reject);

module.exports = router;