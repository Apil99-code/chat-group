import Trip from "../models/trip.model.js";

// Create a new trip
export const createTrip = async (req, res) => {
  try {
    const { 
      title, 
      startDate, 
      endDate, 
      location, 
      coordinates, 
      members, 
      budget, 
      description, 
      groupId,
      status,
      image,
      activities,
      accommodation,
      transportation,
      isPublic
    } = req.body;

    if (!title || !startDate || !endDate || !location || !coordinates || !members || !budget) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Validate dates
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: "End date must be after start date" });
    }

    const newTrip = await Trip.create({
      title,
      startDate,
      endDate,
      location,
      coordinates,
      members,
      budget,
      description,
      groupId,
      status,
      image,
      activities,
      accommodation,
      transportation,
      isPublic,
      userId: req.user.id,
    });

    res.status(201).json(newTrip);
  } catch (error) {
    res.status(500).json({ message: "Failed to create trip", error: error.message });
  }
};

// Get all trips for a user
export const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({
      $or: [
        { userId: req.user.id },
        { sharedWith: req.user.id },
        { sharedGroups: { $in: req.user.groups } },
        { isPublic: true }
      ]
    }).sort({ startDate: 1 });
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch trips", error: error.message });
  }
};

// Update a trip
export const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findOne({ _id: id, userId: req.user.id });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const updatedTrip = await Trip.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedTrip);
  } catch (error) {
    res.status(500).json({ message: "Failed to update trip", error: error.message });
  }
};

// Delete a trip
export const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findOne({ _id: id, userId: req.user.id });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    await Trip.findByIdAndDelete(id);
    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete trip", error: error.message });
  }
};

// Share trip with users or groups
export const shareTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const { sharedWith, sharedGroups, isPublic } = req.body;

    const trip = await Trip.findOne({ _id: id, userId: req.user.id });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const updatedTrip = await Trip.findByIdAndUpdate(
      id,
      {
        $set: { isPublic },
        $addToSet: {
          sharedWith: { $each: sharedWith || [] },
          sharedGroups: { $each: sharedGroups || [] }
        }
      },
      { new: true }
    );

    res.status(200).json(updatedTrip);
  } catch (error) {
    res.status(500).json({ message: "Failed to share trip", error: error.message });
  }
};
