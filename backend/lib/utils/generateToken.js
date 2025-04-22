// Import the jsonwebtoken package to create and verify JWTs (JSON Web Tokens)
import jwt from "jsonwebtoken";

// Export a utility function to generate a JWT token and set it in the response cookies
export const generateTokenAndSetCookie = (userId, res) => {
	// Create a JWT token using the userId payload and a secret key from environment variables
	const token = jwt.sign(
		{ userId }, // Payload: includes the user ID
		process.env.JWT_SECRET, // Secret key stored securely in environment variables
		{
			expiresIn: "15d", // Token will expire in 15 days
		}
	);

	// Set the JWT token in a cookie named "jwt" in the HTTP response
	res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, // Set cookie expiration to 15 days in milliseconds
		httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript, preventing XSS attacks
		sameSite: "strict", // Restricts the cookie to same-site requests to protect against CSRF attacks
		secure: process.env.NODE_ENV !== "development", // Ensures cookie is only sent over HTTPS in production
	});
};
