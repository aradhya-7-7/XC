// Import the Mongoose library, used to interact with MongoDB in an object-oriented way
import mongoose from "mongoose";

// Define a schema for the "User" model using Mongoose
const userSchema = new mongoose.Schema(
	{
		// Username field: must be a string, required, and unique
		username: {
			type: String,
			required: true,
			unique: true,
		},
		// Full name field: must be a string and is required
		fullName: {
			type: String,
			required: true,
		},
		// Password field: must be a string, required, and have a minimum length of 6 characters
		password: {
			type: String,
			required: true,
			minLength: 6,
		},
		// Email field: must be a string, required, and unique
		email: {
			type: String,
			required: true,
			unique: true,
		},
		// Followers field: array of ObjectIds referencing other users (User model)
		followers: [
			{
				type: mongoose.Schema.Types.ObjectId, // Each ID is a reference
				ref: "User", // Referencing the "User" model
				default: [], // Default is an empty array
			},
		],
		// Following field: array of ObjectIds referencing other users (User model)
		following: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				default: [],
			},
		],
		// Profile image URL: optional string, defaults to empty string
		profileImg: {
			type: String,
			default: "",
		},
		// Cover image URL: optional string, defaults to empty string
		coverImg: {
			type: String,
			default: "",
		},
		// User bio: optional string, defaults to empty string
		bio: {
			type: String,
			default: "",
		},
		// External link (e.g., personal website or portfolio): optional string
		link: {
			type: String,
			default: "",
		},
		// Liked posts: array of ObjectIds referencing posts (Post model)
		// likedPosts: [
		// 	{
		// 		type: mongoose.Schema.Types.ObjectId,
		// 		ref: "Post",
		// 		default: [],
		// 	},
		// ],
	},
	// Schema options: adds `createdAt` and `updatedAt` timestamps automatically
	{ timestamps: true }
);

// Create a model named "User" using the schema defined above
const User = mongoose.model("User", userSchema);

// Export the User model to be used in other parts of the application
export default User;
