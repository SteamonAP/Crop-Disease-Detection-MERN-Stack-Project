import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import http from "http"; // Import http module for creating server

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express(); // Create an instance of Express
const PORT = process.env.PORT || 3000; // Set default port

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));

app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../sp-frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../sp-frontend", "dist", "index.html"));
    });
}

const server = http.createServer(app); // Create a server instance with Express app

server.listen(PORT, () => {
    console.log(`Server running at port: ${PORT}`);
    connectDB();
});
