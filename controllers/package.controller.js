const Package = require("./../models/package.model");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/AppError");
const { validatePackageCreation } = require("./../validation/package");
const geocodeAddress = require("./../helper/geocodeAddress");

const createPackage = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { error } = validatePackageCreation(req.body);
  if (error) {
    console.log(error);
    return next(new AppError(error.message, 400));
  }

  const {
    name,
    weight,
    itemType,
    senderAddress,
    receiverName,
    receiverPhone,
    receiverEmail,
    receiverAddress,
  } = req.body;

  const senderLocation = await geocodeAddress(senderAddress);
  const receiverLocation = await geocodeAddress(receiverAddress);

  const package = await Package.create({
    name,
    weight,
    itemType,
    senderAddress,
    senderLatitude: senderLocation.latitude,
    senderLongitude: senderLocation.longitude,
    receiverName,
    receiverPhone,
    receiverEmail,
    receiverAddress,
    receiverLatitude: receiverLocation.latitude,
    receiverLongitude: receiverLocation.longitude,
    senderId: userId,
  });

  if (!package) {
    return next(new AppError("Could not create package", 500));
  }
  res.status(201).json({
    status: "success",
    data: {
      package,
    },
  });
});

module.exports = { createPackage };
