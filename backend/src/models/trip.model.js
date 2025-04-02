import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: { type: String, required: true },
    coordinates: { type: [Number], required: true },
    members: { type: Number, required: true },
    budget: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['planning', 'upcoming', 'ongoing', 'completed'],
      default: 'planning'
    },
    description: { type: String },
    image: { type: String },
    activities: [{ type: String }],
    accommodation: { type: String },
    transportation: { type: String },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sharedWith: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    sharedGroups: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group"
    }],
    isPublic: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Trip", tripSchema);
