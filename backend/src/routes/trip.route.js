import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { 
  createTrip, 
  getTrips, 
  updateTrip, 
  deleteTrip,
  shareTrip
} from "../controllers/trip.controller.js";

const router = express.Router();

// All routes are protected
router.use(protectRoute);

// Create a new trip
router.post("/", createTrip);

// Get all trips for a user
router.get("/", getTrips);

// Update a trip
router.put("/:id", updateTrip);

// Delete a trip
router.delete("/:id", deleteTrip);

// Share trip with users or groups
router.post("/:id/share", shareTrip);

export default router;
