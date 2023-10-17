import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import usersRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SEC,
});

const app = express();
const PORT = process.env.PORT || 3030;
connectDB();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(cors());

app.use("/api/users", usersRoutes);
app.use("/api/posts", postRoutes);
app.get("/", (req, res) => {
  res.json({ message: "SIMPLE CRUD API FOR THREAD CLONE PROJECT" });
});

app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
});
