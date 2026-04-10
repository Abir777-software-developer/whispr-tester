import express from "express";
import { protect } from "../middleware/authmiddleware.js";
import { sendMessage, allMessage, summarizeMessages } from "../controllers/messageController.js";
import { messageLimiter, aiLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

router.route("/").post(protect, messageLimiter, sendMessage);
router.route("/summarize").post(protect, aiLimiter, summarizeMessages);
router.route("/:chatId").get(protect, allMessage);
export default router;


