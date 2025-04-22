// Import the User model to query the database for the authenticated user
import User from "../models/user.model.js";

// Import jsonwebtoken to verify and decode the JWT token
import jwt from "jsonwebtoken";

// Define the protectRoute middleware function
export const protectRoute = async (req, res, next) => {
	try {
		// Get the JWT token from the cookies
		const token = req.cookies.jwt;

		// If no token is found, return a 401 Unauthorized response
		if (!token) {
			return res.status(401).json({ error: "Unauthorized: No Token Provided" });
		}

		// Verify the token using the secret key from environment variables
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// If decoding fails or token is invalid, respond with Unauthorized
		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized: Invalid Token" });
		}

		// Find the user by ID embedded in the token, and exclude the password field
		const user = await User.findById(decoded.userId).select("-password");

		// If no user is found, respond with a 404 Not Found error
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Attach the user data to the request object for access in next middleware or controller
		req.user = user;

		// Call the next middleware or route handler
		next();
	} catch (err) {
		// Log any errors for debugging
		console.log("Error in protectRoute middleware", err.message);

		// Respond with a 500 Internal Server Error if something unexpected goes wrong
		return res.status(500).json({ error: "Internal Server Error" });
	}
};
