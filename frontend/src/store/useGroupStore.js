import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useGroupStore = create((set, get) => ({
  groups: [],
  groupMessages: [],
  selectedGroup: null,
  isGroupsLoading: false,
  isGroupMessagesLoading: false,
  isMessageSending: false,
  isCreatingGroup: false,

  getGroups: async () => {
    set({ isGroupsLoading: true });
    try {
      const res = await axiosInstance.get("/groups");
      set({ groups: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch groups");
    } finally {
      set({ isGroupsLoading: false });
    }
  },

  getGroupMessages: async (groupId) => {
    set({ isGroupMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/groups/${groupId}/messages`);
      set({ groupMessages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isGroupMessagesLoading: false });
    }
  },

  createGroup: async (groupData) => {
    set({ isCreatingGroup: true });
    try {
      const res = await axiosInstance.post("/groups", groupData);
      set((state) => ({ 
        groups: [...state.groups, res.data],
        isCreatingGroup: false
      }));
      toast.success("Group created successfully");
      return res.data;
    } catch (error) {
      set({ isCreatingGroup: false });
      const errorMessage = error.response?.data?.message || "Failed to create group";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  sendGroupMessage: async (messageData) => {
    const { selectedGroup, groupMessages } = get();
    if (!selectedGroup || !selectedGroup._id) {
      toast.error("No valid group selected");
      return;
    }

    set({ isMessageSending: true });
    try {
      const res = await axiosInstance.post(`/groups/${selectedGroup._id}/messages`, messageData);
      set({
        groupMessages: [...groupMessages, res.data],
        isMessageSending: false,
      });
      return res.data;
    } catch (error) {
      set({ isMessageSending: false });
      const errorMessage = error.response?.data?.message || "Failed to send message";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  subscribeToGroupMessages: () => {
    const { selectedGroup } = get();
    if (!selectedGroup || !selectedGroup._id) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) {
      console.error("Socket not initialized");
      return;
    }

    socket.off("newGroupMessage");

    socket.on("newGroupMessage", (newMessage) => {
      if (newMessage.groupId !== selectedGroup._id) return;

      set((state) => ({
        groupMessages: [...state.groupMessages, newMessage],
      }));
    });

    socket.emit("joinGroup", selectedGroup._id);
  },

  unsubscribeFromGroupMessages: () => {
    const { selectedGroup } = get();
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    if (selectedGroup) {
      socket.emit("leaveGroup", selectedGroup._id);
    }
    
    socket.off("newGroupMessage");
  },

  setSelectedGroup: (selectedGroup) => {
    const prevGroup = get().selectedGroup;
    if (prevGroup) {
      const socket = useAuthStore.getState().socket;
      if (socket) {
        socket.emit("leaveGroup", prevGroup._id);
      }
    }
    set({ selectedGroup });
  }
}));