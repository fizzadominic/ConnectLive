
import express from 'express';
import dotenv from 'dotenv';
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.auth.routes.js";


dotenv.config();

const app = express();
const __dirname = path.resolve();

const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoutes);

app.use("/api/messages", messageRoutes);

// make ready for deployment 
if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname, "../FRONTEND/dist")));

    // any path other than api routes 
    app.get("*", (_, res)=>{
        res.sendFile(path.join(__dirname, "../FRONTEND/dist/index.html"));
    })
}




app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
});



