const { validationResult, check } = require("express-validator");
const { Model } = require("sequelize");

const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach((error) => (errors[error.path] = error.msg));

    const err = Error("Bad request");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request";
    next(err);
  }
  next();
};

/*
  
  model: Group
  attributes:{
    name:true, -> name is required
    about:false, -> about is not required, but will be checked if exists
    private:undefined -> private is not checked and does not exist
  }
  
  if attributes is undefined then everything will default to true
  
  */

const validations = (options) => {
  const genCheck = (attribute, { attributes }) => {
    const prefix = check(attribute);
    if (attributes === undefined) return prefix.exists();
    if (attributes === false) return prefix.optional();
    const isOptional = attributes[attribute];
    if (isOptional === undefined) return undefined;
    return isOptional ? prefix.optional() : prefix.exists();
  };
  const validateLatitude = (value) => {
    if (typeof value !== "number") {
      throw new Error("Latitude must be a number");
    }
    if (value < -90 || value > 90) {
      throw new Error("Latitude must be between -90 and 90");
    }
    return true;
  };

  const validateLongitude = (value) => {
    if (typeof value !== "number") {
      throw new Error("Longitude must be a number");
    }
    if (value < -180 || value > 180) {
      throw new Error("Longitude must be between -180 and 180");
    }
    return true;
  };

  const inRange =
    (range = [0, Infinity]) =>
    (num) => {
      const [lower, upper] = range;
      if (num < lower || num > upper) {
        throw new Error("value is not in range");
      }
      return true;
    };

  const isAfterDate =
    (field) =>
    (value, { req }) => {
      const comparisonDate = field ? new Date(req.body[field]) : new Date();

      if (new Date(value) <= comparisonDate) {
        throw new Error("Date must be in the future");
      }

      return true;
    };

  const spot = {
    address: genCheck("address", options)
      ?.notEmpty()
      .withMessage("Street address is required"),
    city: genCheck("city", options)?.notEmpty().withMessage("City is required"),
    state: genCheck("state", options)
      ?.notEmpty()
      .withMessage("State is required"),
    country: genCheck("country", options)
      ?.notEmpty()
      .withMessage("Country is required"),
    lat: genCheck("lat", options)
      ?.isDecimal({ decimal_digits: "1," })
      .custom(validateLatitude)
      .withMessage("Latitude must be within -90 and 90"),
    lng: genCheck("lng", options)
      ?.isDecimal({ decimal_digits: "1," })
      .custom(validateLongitude)
      .withMessage("Longitude must be within -180 and 180"),
    name: genCheck("name", options)
      ?.isLength({ min: 1, max: 50 })
      .withMessage("Name must be less than 50 characters"),
    description: genCheck("description", options)
      ?.notEmpty()
      .withMessage("Description is required"),
    price: genCheck("price", options)
      ?.isFloat({ min: 0, max: Infinity })
      .withMessage("Price per day must be a positive number"),
  };
  const review = {
    review: genCheck("review", options)
      ?.notEmpty()
      .withMessage("Review text is required"),
    stars: genCheck("stars", options)
      ?.isInt({ min: 1, max: 5 })
      .withMessage("Stars must be an integer from 1 to 5"),
  };

  const booking = {
    startDate: genCheck("startDate", options)
      ?.notEmpty()
      .withMessage("startDate cannot be in the past")
      .custom(isAfterDate())
      .withMessage("startDate cannot be in the past"),
    endDate: genCheck("endDate", options)
      ?.notEmpty()
      .withMessage("endDate cannot be on or before startDate")
      .custom(isAfterDate("startDate"))
      .withMessage("endDate cannot be on or before startDate"),
  };

  const spotquery = {
    page: check("page")
      .optional()
      .isInt({ min: 1, max: 10 })
      .withMessage(
        "Page must be greater than or equal to 1 and less than or equal to 10"
      ),
    size: check("size")
      .optional()
      .isInt({ min: 1, max: 20 })
      .withMessage(
        "Size must be greater than or equal to 1 and less than or equal to 20"
      ),
    minLat: check("minLat")
      .optional()
      .isDecimal({ decimal_digits: "1," })
      .custom(validateLatitude)
      .withMessage("Minimum latitude is invalid"),
    maxLat: check("maxLat")
      .optional()
      .isDecimal({ decimal_digits: "1," })
      .custom(validateLatitude)
      .withMessage("Maximum latitude is invalid"),
    minLng: check("minLng")
      .optional()
      .isDecimal({ decimal_digits: "1," })
      .custom(validateLongitude)
      .withMessage("Minimum longitude is invalid"),
    maxLng: check("maxLng")
      .optional()
      .isDecimal({ decimal_digits: "1," })
      .custom(validateLongitude)
      .withMessage("Maximum longitude is invalid"),
    minPrice: check("minPrice")
      .optional()
      .isDecimal({ decimal_digits: "1," })
      .custom(inRange)
      .withMessage("Minimum price must be greater than or equal to 0"),
    maxPrice: check("maxPrice")
      .optional()
      .isDecimal({ decimal_digits: "1," })
      .custom(inRange)
      .withMessage("Maximum price must be greater than or equal to 0"),
  };

  const validationObj = {
    spot,
    spotquery,
    review,
    booking,
  };
  return validationObj[options.model.toLowerCase()];
};

const validate = (options) => {
  if (typeof options === "string") {
    return [
      ...Object.values(validations({ model: options })),
      handleValidationErrors,
    ];
  }
  return [
    ...Object.values(validations(options)).filter((ele) => ele !== undefined),
    handleValidationErrors,
  ];
};

module.exports = { handleValidationErrors, validate };
