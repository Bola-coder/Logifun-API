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

const cancelPackage = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const packageId = req.params.packageId;

  if (!packageId) {
    return next(
      new AppError("Please provide the package ID in the request params", 400)
    );
  }

  const package = await Package.findByPk(packageId);

  if (!package) {
    return next(new AppError("Package with the specified ID not found", 404));
  }

  if (package.senderId !== userId) {
    return next(
      new AppError(
        "The package requested does not belong to the logged in user"
      )
    );
  }

  // Check if the package is not in transit or out for delivery yet
  if (package.status !== "pending") {
    return next(
      new AppError(
        "You can only cancel packages that are pending. The package of the status is no longer pending",
        404
      )
    );
  }

  await package.update({ status: "cancelled" });
  await package.save({
    validate: true,
  });

  res.status(200).json({
    status: "success",
    message: "Package cancelled successfully",
    data: {
      package,
    },
  });
});

const updatePackageStatus = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const packageId = req.params.packageId;

  if (!packageId) {
    return next(
      new AppError("Please provide the package ID in the request params", 400)
    );
  }

  const package = await Package.findByPk(packageId);

  if (!package) {
    return next(new AppError("Package with the specified ID not found", 404));
  }

  if (package.senderId !== userId) {
    return next(
      new AppError(
        "The package requested does not belong to the logged in user"
      )
    );
  }

  const { status } = req.body;

  if (
    status !== "pending" &&
    status !== "in-transit" &&
    status !== "out-for-delivery"
  ) {
    return next(
      new AppError(
        "Invalid status. Status can only be pending in-transit or out-for-delivery before it can be changed",
        400
      )
    );
  }

  await package.update({ status });
  await package.save({
    validate: true,
  });

  res.status(200).json({
    status: "success",
    message: "Package status updated successfully",
    data: {
      package,
    },
  });
});

module.exports = { createPackage, cancelPackage, updatePackageStatus };
