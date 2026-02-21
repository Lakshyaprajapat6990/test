require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const poojaRoutes = require("./routes/poojaRoutes");
const templeRoutes = require("./routes/templeRoutes");
const chadavaRoutes = require("./routes/chadhavaRoutes");
const payRoutes = require("./routes/payRoutes");
const fileRoutes = require("./routes/fileRoutes");
const reviewsRoutes = require('./routes/reviewsRoutes')
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();

// Middlewares
// Parse multiple origins from CLIENT_URL environment variable
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000")
  .split(",")
  .map((url) => url.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Log for debugging
        console.log("CORS rejected origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Favicon handler (prevent 404 errors in browser)
app.get("/favicon.ico", (req, res) => res.status(204).end());

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Dev Yogam API",
      version: "1.0.0",
      description: "API documentation for Dev Yogam (Users, Poojas, Temples, Payments, Files)",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
      },
    ],
  },
  apis: [path.join(__dirname, "./routes/*.js")],
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/poojas", poojaRoutes);
app.use("/api/temples", templeRoutes);
app.use("/api/chadhavas", chadavaRoutes);
app.use("/api/payment", payRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/reviews", reviewsRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Initialize DB connection (call once before starting server or on first import)
async function init() {
  await connectDB();
}

module.exports = { app, init };
