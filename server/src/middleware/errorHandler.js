export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const statusCode = err.statusCode || err.status || 500;
  const payload = {
    message: statusCode === 500 ? "Server error" : err.message
  };

  if (process.env.NODE_ENV !== "production") {
    payload.details = err.message;
  }

  res.status(statusCode).json(payload);
}
