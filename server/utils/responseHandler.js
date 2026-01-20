const responseHandler = (res, statusCode, message, data = null, success = true) => {
  res.status(statusCode).json({
    success,
    message,
    data,
  });
};

module.exports = responseHandler;
