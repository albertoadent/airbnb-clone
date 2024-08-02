const { authorization } = require("./auth");
const auth = require("./auth");
const { validate } = require("./validation");

const validateAuth = (validateOptions, authOptions) => {
  return (
    [
      ...authorization(authOptions),
      validateOptions ? validate(validateOptions) : undefined,
    ].filter((ele) => ele !== undefined) || []
  );
};

const checkFor = (toCheck) => {
  const {
    validation = undefined,
    requireAuth,
    exists,
    authorization,
  } = toCheck || {};

  if (
    validation !== undefined ||
    requireAuth !== undefined ||
    exists !== undefined ||
    authorization !== undefined
  ) {
    return validateAuth(validation, { requireAuth, exists, authorization });
  }

  if (typeof param2 === "function") {
    if (process.env.NODE_ENV === "development") {
      console.log(toCheck.method, toCheck.url, "checkFor not used correctly");
    }
    return param2(); // if checkFor isn't called
  }

  return (req, res, next) => {
    if (process.env.NODE_ENV === "development") {
      console.log(req.method, req.url, "checkFor has empty params");
    }
    next();
  };
};

const route = (router = require("express").Router()) => {
  const handleResponse = (status) => (req, res, next) => {
    try {
      const { response } = req;
      if (!response) return next();
      res.status(status || req.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  };
  const wrapAsync = (responseCb) => async (req, res, next) => {
    try {
      req.response = await responseCb(req);
      next();
    } catch (error) {
      next(error);
    }
  };

  const genMiddlewareArray = (hasMiddleware, responseCb, status = 200) => {
    if (status === 0) return (r, s, n) => [n()];
    if (typeof hasMiddleware === "object" && hasMiddleware !== null)
      return [
        ...checkFor(hasMiddleware),
        wrapAsync(responseCb),
        handleResponse(status),
      ];
    else return [wrapAsync(responseCb), handleResponse(status)];
  };

  const get = (url, hasMiddleware, responseCb = hasMiddleware) => {
    router.get(url, genMiddlewareArray(hasMiddleware, responseCb));
  };

  const post = (url, hasMiddleware, responseCb = hasMiddleware) => {
    router.post(url, genMiddlewareArray(hasMiddleware, responseCb, 201));
  };
  const put = (url, hasMiddleware, responseCb = hasMiddleware) => {
    router.put(url, genMiddlewareArray(hasMiddleware, responseCb));
  };
  const del = (url, hasMiddleware, responseCb = hasMiddleware) => {
    router.delete(url, genMiddlewareArray(hasMiddleware, responseCb));
  };
  const use = (url, hasMiddleware, responseCb = hasMiddleware) => {
    router.use(url, genMiddlewareArray(hasMiddleware, responseCb));
  };
  const catchRoute = (
    url,
    hasMiddleware,
    responseCb = hasMiddleware,
    method
  ) => {
    // console.log(method)
    const arr = [
      (error, r, rs, n) => {
        if (r.method === method) {
          r.errorStatus = error.status || 500;
          return n();
        }
        return n(error);
      },
      (r, rs, n) => {
        if (r.method === method) {
          return n();
        }
        return n({message:"Skip route"});
      },
      ...genMiddlewareArray(hasMiddleware, responseCb),
      (error, r, rs, n) => {
        if (r.method === method) {
          r.errorStatus = error.status || 500;
          return n(error);
        }
        return n();
      },
    ];

    router.use(url, arr);
  };

  const throwError = (status, message, errors = {}) => {
    const error = new Error(message);
    error.status = status || 404;
    if (!error.message) {
      switch (status) {
        case 404:
          error.message = "Resource not Found";
          break;
        case 400:
          error.message = "Bad Request";
          break;
        case 401:
          error.message = "Authentication Required";
          break;
        case 403:
          error.message = "Forbidden";
          break;
        default:
          error.message = "Error message not specified";
      }
    }
    error.errors = errors;
    throw error;
  };

  const models = require("../db/models");

  return {
    get,
    put,
    post,
    del,
    use,
    catchRoute,
    throwError,
    router,
    ...models,
  };
};

module.exports = route;
