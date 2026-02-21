const serverless = require("serverless-http");
const { app, init } = require("../app");

// Initialize DB once when the function is cold-started
init().catch((err) => {
  console.error("DB init failed:", err);
});

module.exports = serverless(app);
