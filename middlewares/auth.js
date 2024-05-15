const jwt = require("jsonwebtoken");
const AppError = require("./../utils/AppError");
const catchAsync = require("./../utils/catchAsync");
const User = require("./../models/user.model");

const protectRoutes = catchAsync(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next(
      new AppError(
        "You are currently not logged in. Please sign in to continue",
        401
      )
    );
  }

  // Verify the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded.id) {
    return next(
      new AppError("Invalid token supplied, Please login again", 401)
    );
  }

  const user = await User.findByPk(decoded.id);

  if (!user) {
    return next(new AppError("User with the token supplied not found", 404));
  }

  req.user = user;
  next();
});

const verifyIsAdmin = catchAsync(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(
      new AppError("This endpoint is restricted to admin users", 401)
    );
  }
  next();
});

const isEmailVerified = catchAsync(async (req, res, next) => {
  if (!req.user.emailVerified) {
    return next(new AppError("Please verify your email address", 401));
  }

  next();
});

module.exports = { protectRoutes, verifyIsAdmin, isEmailVerified };
