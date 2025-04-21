// Import the Express module, which is a minimal and flexible Node.js web application framework
import express from "express";
import dotenv from "dotenv"
import authRoutes from "./routes/auth.routes.js"
import connectMongoDB from "./db/connectMongoDB.js";
// Create an instance of the Express application
const app = express();
const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes)

dotenv.config()
// console.log(process.env.MONGO_URI)

// Start the Express server on port 8000 and provide a callback to run when the server starts
app.listen(PORT, () => {
   // Log a message to the console indicating the server is running
   console.log(`Server is running @${PORT}`);
   connectMongoDB();
});
