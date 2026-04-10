import express from "express";
import { protect } from "../middleware/authmiddleware.js";
import { accessChats } from "../controllers/chatControllers.js";
import { fetchChats } from "../controllers/chatControllers.js";
import { createGroupChats } from "../controllers/chatControllers.js";
import { renameGroup } from "../controllers/chatControllers.js";
import { addgroup } from "../controllers/chatControllers.js";
import { removefromgroup } from "../controllers/chatControllers.js";
const router = express.Router();

router.route("/").post(protect, accessChats); //for accessing the chat and creating the chat the user have to be logged in
router.route("/").get(protect, fetchChats); //for frtching the chats of the current user
router.route("/group").post(protect, createGroupChats);
router.route("/rename").put(protect, renameGroup);
router.route("/groupremove").put(protect, removefromgroup);
router.route("/groupadd").put(protect, addgroup);

export default router;
