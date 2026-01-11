import express from 'express';
import { login, signup, logout , updateProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { arcjetProtection } from '../middleware/arcjet.middleware.js';

const router = express.Router();


// router.use(arcjetProtection);

router.post("/signup", signup);

router.get("/login", login);

router.get("/logout",logout);

// if user wants to update a profile they must be authenticated 
router.put("/profile-update", protectRoute , updateProfile);

router.get("/check", protectRoute, (req, res) => res.status(200).json(req.user));



export default router;