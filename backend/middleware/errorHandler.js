// Centralized error handler. Controllers can throw plain errors (via
// express-async-handler) and this normalizes the JSON shape returned to
// the client, without leaking stack traces in production.
export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || "Something went wrong on our end.",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
