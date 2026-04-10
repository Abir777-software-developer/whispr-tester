import express from "express";
import { registerUser, authUser } from "../controllers/userControllers.js";
import { allUsers } from "../controllers/userControllers.js";
import { protect } from "../middleware/authmiddleware.js";
import { authLimiter, searchLimiter } from "../middleware/rateLimitMiddleware.js";
const router = express.Router();

router.route("/").post(authLimiter, registerUser).get(protect, searchLimiter, allUsers);
router.post("/login", authLimiter, authUser);


export default router;
