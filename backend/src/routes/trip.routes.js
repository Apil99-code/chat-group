import express from "express";
import { 
  createTrip, 
  getTrips, 
  getTrip, 
  updateTrip, 
  deleteTrip,
  createTripFromChat,
  updateTripMembers,
  getTripExpenses
} from "../controllers/trip.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

// Basic CRUD routes
router.post("/", createTrip);
router.get("/", getTrips);
router.get("/:id", getTrip);
router.put("/:id", updateTrip);
router.delete("/:id", deleteTrip);

// New collaboration routes
router.post("/from-chat", createTripFromChat);
router.put("/:tripId/members", updateTripMembers);
router.get("/:tripId/expenses", getTripExpenses);

export default router; 