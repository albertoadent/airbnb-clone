const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../config");
const { User } = require("../db/models");

const { secret, expiresIn } = jwtConfig;

const setTokenCookie = (res, user) => {
  // Create the token.
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
  };
  const token = jwt.sign(
    { data: safeUser },
    secret,
    { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
  );

  const isProduction = process.env.NODE_ENV === "production";

  // Set the token cookie
  res.cookie("token", token, {
    maxAge: expiresIn * 1000, // maxAge in milliseconds
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && "Lax",
  });

  return token;
};

const restoreUser = (req, res, next) => {
  // token parsed from cookies
  const { token } = req.cookies;
  req.user = null;

  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (err) {
      return next();
    }

    try {
      const { id } = jwtPayload.data;
      req.user = await User.findByPk(id, {
        attributes: {
          include: ["email", "createdAt", "updatedAt"],
        },
      });
    } catch (e) {
      res.clearCookie("token");
      return next();
    }

    if (!req.user) res.clearCookie("token");

    return next();
  });
};

const requireAuth = function (req, _res, next) {
  if (req.user) return next();

  const err = new Error("Authentication required");
  err.title = "Authentication required";
  err.errors = { message: "Authentication required" };
  err.status = 401;
  // return _res.status(err.status).json({
  //   message: "Authentication required",
  // });
  return next(err);
};

const exists = (options) => async (req, res, next) => {
  try {
    const bodyKeys = Object.keys(req.body).filter((key) => key.endsWith("Id"));
    bodyKeys.forEach((keyId) => (req.params[keyId] = req.body[keyId]));
    const promises = Object.keys(req.params).map(async (modelId) => {
      let modelName = modelId.replace("Id", "");
      if (modelName === "owner") modelName = "user";
      const capitalizedModelName =
        modelName.charAt(0).toUpperCase() + modelName.slice(1);
      console.log(capitalizedModelName);
      const Model = require(`../db/models`)[capitalizedModelName];
      // console.log(Model);
      if (req.params[modelId] === null) {
        err = new Error(`${capitalizedModelName} is null`);
        err.status = 404;
        throw err;
      }
      // console.log(options);
      const modelInstance = await Model.findByPk(
        req.params[modelId],
        options === true
          ? undefined
          : (options && options[modelName.toLowerCase()]) || options
      );
      // console.log(modelInstance);
      if (!modelInstance) {
        err = new Error(`${capitalizedModelName} couldn't be found`);
        err.status = 404;
        throw err;
      }
      if (modelName === "user") {
        // await populateUser(modelInstance);
        req.otherUser = modelInstance;
      } else if (!req[modelName]) req[modelName] = modelInstance;
      // console.log(req[modelName]);
    });
    bodyKeys.forEach((keyId) => delete req.params[keyId]);
    await Promise.all(promises);
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const authorizeUser = (options) => async (req, res, next) => {
  try {
    const { params, user } = req;

    // console.log("authUser403 options",options)

    const throw403 = () => {
      const error = new Error("Forbidden");
      error.status = 403;
      throw error;
    };

    //All routes have only one param

    //get the key (modelId)
    const [param] = Object.keys(params);
    const modelName = param.split("Id")[0];

    //get the instance from the req object
    const paramInstance = req[modelName];

    const modelsToCheck =
      options === undefined ? [modelName] : Object.keys(options);

    if (modelsToCheck.length > 1) {
      const instance = await paramInstance.getSpot();
    }

    const passAuth = (modelInstance, modelName) => {
      // console.log("authing",modelName,":",modelInstance.toJSON())
      //make function to make sure that something is indeed the user's
      const isUsers = (model) =>
        model.userId === user.id || model.ownerId === user.id;

      //figure out if param model is the users
      const modelIsUsers = isUsers(modelInstance);

      //figure out if it should be the users
      if (typeof options === "object") {
        const shouldBeUsers =
          options[modelName] === undefined || options[modelName];

        //if it doesn't coincide with the options object then throw 403
        if (shouldBeUsers !== modelIsUsers) {
          if (process.env.NODE_ENV === "development") {
            console.log("should be users is not equvalent to it being users");
          }
          throw403();
        }
      } else {
        if (!modelIsUsers) {
          if (process.env.NODE_ENV === "development") {
            console.log("Model is not users");
          }
          throw403();
        }
      }
    };
    if (modelsToCheck.length > 1) {
      try {
        modelsToCheck[1] = passAuth(instance, modelsToCheck[1]);
      } catch (e) {
        modelsToCheck[0] = passAuth(paramInstance, modelsToCheck[0]);
        return next();
      }
      return next();
    }

    modelsToCheck[0] = passAuth(paramInstance, modelsToCheck[0]);

    next();
  } catch (error) {
    next(error);
  }
};

const authorization = (optionsObj) => {
  const {
    requireAuth: check401 = true,
    exists: check404 = true,
    authorization: check403,
  } = optionsObj;

  // console.log("options",check401,check403,check404)

  return [
    check401 ? requireAuth : undefined,
    check404
      ? exists(typeof check404 === "boolean" ? undefined : check404)
      : undefined,
    check403
      ? authorizeUser(typeof check403 === "boolean" ? undefined : check403)
      : undefined,
  ].filter((func) => func !== undefined);
};

module.exports = {
  setTokenCookie,
  restoreUser,
  requireAuth,
  authorization,
};
