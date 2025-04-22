// Import the utility function to generate JWT token and set it as a cookie
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

// Import the User model (Mongoose schema)
import User from "../models/user.model.js";

// Import bcrypt for hashing passwords securely
import bcrypt from "bcryptjs";

// ======================= SIGNUP CONTROLLER =======================
export const signup = async (req, res) => {
   try {
      // Destructure input values from the request body
      const { fullName, username, email, password } = req.body;

      // Regex to validate proper email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      // Return an error if the email format is invalid
      if (!emailRegex.test(email)) {
         return res.status(400).json({ error: "Invalid email format" });
      }

      // Check if the username already exists in the database
      const existingUser = await User.findOne({ username });
      if (existingUser) {
         return res.status(400).json({ error: "Username already taken!" });
      }

      // Check if the email already exists in the database
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
         return res.status(400).json({ error: "Email already in use!" });
      }

      // Enforce password length for security
      if (password.length < 6) {
         return res.status(400).json({ error: "Password must be at least 6 characters long" });
      }

      // Generate a cryptographic salt
      const salt = await bcrypt.genSalt(10);

      // Hash the password using the salt
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create a new user instance with hashed password
      const newUser = new User({
         fullName,
         username,
         email,
         password: hashedPassword,
      });

      // If user creation is successful
      if (newUser) {
         // Generate a JWT token and set it in a cookie
         generateTokenAndSetCookie(newUser._id, res);

         // Save the user in the database
         await newUser.save();

         // Return user details (excluding sensitive info like password)
         res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            email: newUser.email,
            followers: newUser.followers,
            following: newUser.following,
            profileImg: newUser.profileImg,
            coverImg: newUser.coverImg,
         });
      } else {
         // If user creation failed, return an error
         res.status(400).json({ error: "Invalid user data" });
      }

   } catch (error) {
      // Log any error and return a 400 status
      console.log("Error in signup", error.message);
      res.status(400).json({ error: "Internal server error" });
   }
};


// ======================= LOGIN CONTROLLER =======================
export const login = async (req, res) => {
   try {
      // Destructure username and password from request body
      const { username, password } = req.body;

      // Find the user with the provided username
      const user = await User.findOne({ username });

      // Compare the provided password with the hashed password in DB
      const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

      // If no user is found or password is incorrect, return error
      if (!user || !isPasswordCorrect) {
         return res.status(400).json({ error: "Invalid username or password" });
      }

      // Generate JWT token and set it in a cookie
      generateTokenAndSetCookie(user._id, res);

      // Send back user info
      res.status(201).json({
         _id: user._id,
         fullName: user.fullName,
         username: user.username,
         email: user.email,
         followers: user.followers,
         following: user.following,
         profileImg: user.profileImg,
         coverImg: user.coverImg,
      });

   } catch (error) {
      // Log any error and return a 500 Internal Server Error
      console.log("Error in login", error.message);
      res.status(500).json({ error: "Internal server error" });
   }
};


// ======================= LOGOUT CONTROLLER =======================
export const logout = async (req, res) => {
   try {
      // Clear the JWT cookie by setting it to an empty value with maxAge 0
      res.cookie("jwt", "", { maxAge: 0 });

      // Return a success message
      res.status(200).json({ message: "Logged out successfully" });
   } catch (error) {
      // Log any error and return a 500 status
      console.log("Error in logout controller", error.message);
      res.status(500).json({ error: "Internal Server Error" });
   }
};


// ======================= GET ME CONTROLLER =======================
export const getMe = async (req, res) => {
   try {
      // Fetch the current authenticated user from the database using the ID from middleware
      const user = await User.findById(req.user._id).select("-password");

      // Return the user data
      res.status(200).json(user);
   } catch (error) {
      // Log any error and return a 500 status
      console.log("Error in getMe controller", error.message);
      res.status(500).json({ error: "Internal Server Error" });
   }
};
