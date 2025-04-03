import { Trip } from "../models/trip.model.js";
import { Group } from "../models/group.model.js";
import { User } from "../models/user.model.js";

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

    // Ensure members is an array
    const membersArray = Array.isArray(members) ? members : [members];

    // Automatically create a chat group for the trip
    const chatGroup = await Group.create({
      name: `${title} Group`,
      members: [req.user.id, ...membersArray], // Include the creator
    });

    const newTrip = await Trip.create({
      title,
      startDate,
      endDate,
      location,
      coordinates,
      members: membersArray,
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
      chatGroupId: chatGroup._id, // Link the chat group to the trip
    });

    res.status(201).json({ trip: newTrip, chatGroup });
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
          sharedGroups: { $each: sharedGroups || [] },
        },
      },
      { new: true }
    ).populate("sharedWith", "fullName profilePic").populate("sharedGroups", "name");

    res.status(200).json(updatedTrip);
  } catch (error) {
    res.status(500).json({ message: "Failed to share trip", error: error.message });
  }
};

// Mark trip as completed
export const markTripAsCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    trip.status = "completed";
    await trip.save();

    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ message: "Failed to mark trip as completed", error: error.message });
  }
};

// Create a trip from chat
export const createTripFromChat = async (req, res) => {
  try {
    const { title, description, startDate, endDate, destination, budget, chatGroupId } = req.body;
    const userId = req.user._id;

    // Verify chat group exists and user is a member
    const chatGroup = await Group.findById(chatGroupId);
    if (!chatGroup) {
      return res.status(404).json({ message: "Chat group not found" });
    }

    if (!chatGroup.members.includes(userId)) {
      return res.status(403).json({ message: "You must be a member of the chat group to create a trip" });
    }

    // Create new trip with chat group members
    const trip = await Trip.create({
      title,
      description,
      startDate,
      endDate,
      destination,
      budget,
      createdBy: userId,
      members: chatGroup.members,
      chatGroupId,
    });

    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update trip members
export const updateTripMembers = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { members } = req.body;
    const userId = req.user._id;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Verify user is trip creator
    if (trip.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only trip creator can update members" });
    }

    // Verify all new members are in the chat group
    const chatGroup = await Group.findById(trip.chatGroupId);
    const validMembers = members.every(memberId => 
      chatGroup.members.includes(memberId)
    );

    if (!validMembers) {
      return res.status(400).json({ message: "All members must be part of the chat group" });
    }

    trip.members = members;
    await trip.save();

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get trip expenses (both group and personal)
export const getTripExpenses = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user._id;

    const trip = await Trip.findById(tripId)
      .populate({
        path: "expenses",
        populate: {
          path: "createdBy",
          select: "name email"
        }
      });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Verify user is a trip member
    if (!trip.members.includes(userId)) {
      return res.status(403).json({ message: "You must be a trip member to view expenses" });
    }

    // Separate group and personal expenses
    const expenses = {
      group: trip.expenses.filter(expense => expense.isGroupExpense),
      personal: trip.expenses.filter(expense => 
        !expense.isGroupExpense && expense.createdBy._id.toString() === userId.toString()
      )
    };

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
