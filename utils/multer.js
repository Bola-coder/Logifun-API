const multer = require("multer");
const Datauri = require("datauri/parser");
const path = require("path");
const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single("image");

const imageUploads = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 3 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpg|jpeg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(
      "Error: File upload only supports the following filetypes - " + filetypes
    );
  },
}).single("logo");
const dUri = new Datauri();

const dataUri = (req) =>
  dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);

module.exports = { multerUploads, dataUri, imageUploads };
