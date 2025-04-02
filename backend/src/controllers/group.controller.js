import Group from "../models/group.model.js";
import Message from "../models/message.model.js";
import { emitGroupMessage } from "../lib/socket.js";
import cloudinary from "../lib/cloudinary.js";

export const createGroup = async (req, res) => {
  try {
    const { name, memberIds } = req.body;
    const creatorId = req.user._id;

    // Add creator to members if not already included
    if (!memberIds.includes(creatorId)) {
      memberIds.push(creatorId);
    }

    const newGroup = new Group({
      name,
      members: memberIds,
    });

    await newGroup.save();

    // Populate members info
    const populatedGroup = await Group.findById(newGroup._id)
      .populate("members", "username profilePic");

    res.status(201).json(populatedGroup);
  } catch (error) {
    console.error("Error in createGroup: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getGroups = async (req, res) => {
  try {
    const userId = req.user._id;

    const groups = await Group.find({ members: userId })
      .populate("members", "username profilePic")
      .sort({ updatedAt: -1 });

    res.status(200).json(groups);
  } catch (error) {
    console.error("Error in getGroups: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { text, image } = req.body;
    const senderId = req.user._id;

    if (!groupId || !senderId) {
      return res.status(400).json({ error: "Invalid group or sender" });
    }

    console.log("Received message data:", { groupId, text, hasImage: !!image });

    // Check if group exists and user is a member
    const group = await Group.findOne({
      _id: groupId,
      members: senderId
    });
    
    if (!group) {
      return res.status(404).json({ error: "Group not found or you're not a member" });
    }

    let imageUrl;
    if (image) {
      try {
        console.log("Starting image upload to Cloudinary...");
        // Upload base64 image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image, {
          folder: "group-messages",
        });
        console.log("Image upload successful:", uploadResponse.secure_url);
        imageUrl = uploadResponse.secure_url;
      } catch (uploadError) {
        console.error("Failed to upload image:", uploadError);
        return res.status(500).json({ error: "Failed to upload image", details: uploadError.message });
      }
    }

    // Create new message using Message model
    const newMessage = new Message({
      senderId,
      groupId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // Populate sender info
    const populatedMessage = await Message.findById(newMessage._id)
      .populate("senderId", "username profilePic");

    // Emit the message to all group members
    emitGroupMessage(groupId, populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error in sendGroupMessage: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    if (!groupId || !userId) {
      return res.status(400).json({ error: "Invalid group or sender" });
    }
    
    // Check if group exists and user is a member
    const group = await Group.findOne({
      _id: groupId,
      members: userId
    });
    
    if (!group) {
      return res.status(404).json({ error: "Group not found or you're not a member" });
    }

    // Get messages using Message model
    const messages = await Message.find({ groupId })
      .populate("senderId", "username profilePic")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getGroupMessages: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};