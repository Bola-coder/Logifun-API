const Joi = require("joi");

const validatePackageCreation = (obj) => {
  const schema = Joi.object().keys({
    name: Joi.string()
      .required()
      .error(() => new Error("Please provide package name")),
    weight: Joi.number()
      .required()
      .error(() => new Error("Please provide package weight")),
    itemType: Joi.string()
      .valid("normal", "delicate", "vip")
      .required()
      .error(
        () =>
          new Error("Please provide a valid item type (normal, delicate, vip)")
      ),
    senderAddress: Joi.string()
      .required()
      .error(() => new Error("Please provide the sender address")),
    // senderLatitude: Joi.number()
    //   .required()
    //   .error(() => new Error("Please provide sender latitude")),
    // senderLongitude: Joi.number()
    //   .required()
    //   .error(() => new Error("Please provide sender longitude")),
    receiverName: Joi.string()
      .required()
      .error(() => new Error("Please provide receiver name")),
    receiverPhone: Joi.string()
      .required()
      .error(() => new Error("Please provide receiver phone")),
    receiverEmail: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .error(() => new Error("Please provide a valid email address")),
    receiverAddress: Joi.string()
      .required()
      .error(() => new Error("Please provide receiver address")),
    // receiverLatitude: Joi.number()
    //   .required()
    //   .error(() => new Error("Please provide receiver latitude")),
    // receiverLongitude: Joi.number()
    //   .required()
    //   .error(() => new Error("Please provide receiver longitude")),
  });

  return schema.validate(obj);
};

module.exports = { validatePackageCreation };
