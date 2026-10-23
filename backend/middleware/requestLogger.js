
function requestLogger(req, res, next) {
  const startTime = Date.now();

  res.on("finish", () => {
    const responseTime = Date.now() - startTime;

    console.log(
      `[${new Date().toISOString()}] ` +
        `${req.method} ${req.originalUrl} ` +
        `Status: ${res.statusCode} ` +
        `Response Time: ${responseTime}ms`
    );
  });

  next();
}

module.exports = requestLogger;  
