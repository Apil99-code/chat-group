import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    destination: { type: String, required: true },
    budget: { type: Number, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }],
    chatGroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    expenses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expense",
    }],
    status: {
      type: String,
      enum: ["planning", "ongoing", "completed", "cancelled"],
      default: "planning",
    },
    location: { type: String, required: true },
    coordinates: { type: [Number], required: true },
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
      ref: "User",
    }],
    sharedGroups: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    }],
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Trip = mongoose.model("Trip", tripSchema);
