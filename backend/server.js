// Import the Express module, which is a minimal and flexible Node.js web application framework
import express from "express";

// Import dotenv to load environment variables from a .env file into process.env
import dotenv from "dotenv";

// Import cookie-parser to parse cookies attached to the client request object
import cookieParser from "cookie-parser";

// Import authentication-related routes from the specified file
import authRoutes from "./routes/auth.routes.js";

// Import a custom function to connect to the MongoDB database
import connectMongoDB from "./db/connectMongoDB.js";

// Load environment variables from the .env file into process.env
dotenv.config();

// Create an instance of the Express application
const app = express();

// Set the port to the value in the environment variable PORT, or default to 5000 if not specified
const PORT = process.env.PORT || 5000;

// Middleware to parse incoming JSON requests and make the data available in req.body
app.use(express.json());

// Middleware to parse URL-encoded data (typically from HTML forms)
app.use(express.urlencoded({ extended: true }));

// Middleware to parse and populate cookies in req.cookies
app.use(cookieParser());

// Register the authentication routes under the path "/api/auth"
app.use("/api/auth", authRoutes);

// Start the Express server and listen on the specified port
app.listen(PORT, () => {
   // Log a message to indicate the server has started successfully
   console.log(`Server is running @${PORT}`);
   
   // Establish a connection to MongoDB once the server has started
   connectMongoDB();
});
