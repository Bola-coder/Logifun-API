const express = require("express");
const morgan = require("morgan");
const errorHandler = require("./middlewares/error");
const authRoutes = require("./routes/auth.route");
const AppError = require("./utils/AppError");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to Logifun",
  });
});

app.get("/api/v1", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to Logifun API version 1.0.0",
  });
});

app.use("/api/v1/auth", authRoutes);

app.all("*", (req, res, next) => {
  const error = new AppError(
    `Can't find ${req.originalUrl} using method ${req.method} on this server. Route not defined`,
    404
  );
  next(error);
});

app.use(errorHandler);

module.exports = app;
