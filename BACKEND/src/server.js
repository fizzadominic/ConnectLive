import express from "express";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.auth.routes.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

// payload too large error
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));//middleware to get the data, req.body
app.use(
  cors({
    origin: "http://localhost:5173", // Give permission to your Frontend
    credentials: true, // Allow cookies to be sent (needed for JWT)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// make ready for deployment
if (ENV.NODE_ENV === "development") {
  app.use(express.static(path.join(__dirname, "../FRONTEND/dist")));

  // any path other than api routes
  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../FRONTEND/dist/index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  connectDB();
});
