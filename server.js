const express = require("express");
const morgan = require("morgan");

var server = express();
server.use(morgan("dev"));

server.use("/", require("./routes/public"));

// Catch 404 and forward to error handler
server.use(function(_req, _res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handler
server.use(function(err, _req, res, _next) {
  console.error("Error:", err);
  res.status(err.status || 500);
  res.json({
    message: err.message
  });
});

server.listen(process.env["app_port"] || process.env.PORT || 3000, function(err) {
  if (err) {
    console.error("Unable to start server", err.message);
    process.exit(2);
    return;
  }
  console.log("Server started...");
});

process.on("SIGINT", function() {
  console.log( "\nShutting down..." );
  process.exit(0);
});
