const express = require("express");
const authMiddleware = require("./../middlewares/auth");
const packageController = require("./../controllers/package.controller");
const router = express.Router();

router.use(authMiddleware.protectRoutes, authMiddleware.isEmailVerified);
router.route("/").post(packageController.createPackage);
router.route("/cancel/:packageId").patch(packageController.cancelPackage);

module.exports = router;
