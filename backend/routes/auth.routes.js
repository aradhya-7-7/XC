// Import the Express module to create route handlers
import express from "express";

// Import controller functions for handling authentication logic
import { signup, login, logout, getMe } from "../controllers/auth.controller.js";

// Import middleware to protect routes that require authentication
import { protectRoute } from "../middleware/protectRoute.js";

// Create a new router instance from Express to define modular, mountable route handlers
const router = express.Router();

// Define a GET route for "/me" that uses the protectRoute middleware to ensure the user is authenticated
// If authenticated, it calls the getMe controller to return the current user's info
router.get("/me", protectRoute, getMe);

// Define a POST route for "/signup" to register a new user
// Calls the signup controller which handles user registration
router.post("/signup", signup);

// Define a POST route for "/login" to authenticate a user
// Calls the login controller which verifies user credentials and issues a token/cookie
router.post("/login", login);

// Define a POST route for "/logout" to log the user out
// Calls the logout controller which clears authentication tokens or cookies
router.post("/logout", logout);

// Export the configured router to be used in the main app
export default router;
