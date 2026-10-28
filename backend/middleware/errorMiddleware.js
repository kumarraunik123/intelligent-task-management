
function notFoundHandler(req, res, next) {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
}

function errorHandler(err, req, res, next) {
  console.error("API Error:", {
    method: req.method,
    url: req.originalUrl,
    message: err.message,
    stack:
      process.env.NODE_ENV === "production"
        ? undefined
        : err.stack,
  });

  const requestedStatus = err.statusCode || err.status;

  const statusCode =
    Number.isInteger(requestedStatus) &&
    requestedStatus >= 400 &&
    requestedStatus <= 599
      ? requestedStatus
      : 500;

  const message =
    statusCode >= 500
      ? "Internal server error"
      : err.expose === true
        ? err.message
        : "Request failed";

  return res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
