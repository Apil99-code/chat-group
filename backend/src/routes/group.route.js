import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createGroup, getGroups, sendGroupMessage, getGroupMessages, assignRole, getGroupActivityLog } from "../controllers/group.controller.js";

const router = express.Router();

router.post("/", protectRoute, (req, res, next) => {
  const { name, members } = req.body;
  if (!members || members < 1) {
    return res.status(400).json({ message: "Group must have at least one member" });
  }
  next();
}, createGroup);
router.get("/", protectRoute, getGroups);
router.post("/:groupId/messages", protectRoute, sendGroupMessage);
router.get("/:groupId/messages", protectRoute, getGroupMessages);
router.put("/:groupId/roles", protectRoute, assignRole);
router.get("/:groupId/activity-log", protectRoute, getGroupActivityLog);

export default router;