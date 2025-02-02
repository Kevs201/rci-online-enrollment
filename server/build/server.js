"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const cloudinary_1 = require("cloudinary");
const http_1 = __importDefault(require("http"));
const db_1 = __importDefault(require("./utils/db"));
const socketServer_1 = require("./socketServer");
const cors = require('cors'); // Import CORS package
require("dotenv").config();

// Initialize the app
const app = app_1.app;

// CORS configuration: Allow requests from your frontend
const allowedOrigins = ['https://rci-online-enrollment-client.vercel.app'];  // Add your allowed frontend URLs here

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

// Apply CORS middleware
app.use(cors(corsOptions));

// cloudinary config
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
});

// Initialize socket server
(0, socketServer_1.initSocketServer)(server);

// Create HTTP server
const server = http_1.default.createServer(app);

// Start the server
server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    (0, db_1.default)();
});
