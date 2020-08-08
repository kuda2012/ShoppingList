const express = require("express");
const app = express();
const itemsRoutes = require("./routes/items");
const expressErrror = require("./expressError");
const ExpressError = require("./expressError");

app.use(express.json());
app.use("/items", itemsRoutes);

// Error handling

/** 404 handler */
app.use(function (req, res, next) {
  try {
    throw new ExpressError("Not Found", 404);
  } catch (e) {
    next(e);
  }
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err.message,
  });
});

module.exports = app;
