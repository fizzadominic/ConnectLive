import express from "express";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.auth.routes.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";



const app = express();
const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

app.use(express.json()); //middleware to get the data, req.body

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
