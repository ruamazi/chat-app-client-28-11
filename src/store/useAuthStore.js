import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client";

export const useAuthStore = create((set, get) => ({
 authUser: null,
 isSigningUp: false,
 isSigningin: false,
 isUpdatingProfile: false,
 isCheckingAuth: true,
 onlineUsers: [],
 socket: null,

 checkAuth: async () => {
  try {
   const resp = await axiosInstance.get("/auth/check");
   set({ authUser: resp.data });
   get().connectSocket();
  } catch (error) {
   console.log("Error in checkAuth", error);
   set({ authUser: null });
  } finally {
   set({ isCheckingAuth: false });
  }
 },

 signup: async (data) => {
  toast.dismiss();
  set({ isSigningUp: true });
  try {
   const resp = await axiosInstance.post("/auth/signup", data);
   set({ authUser: resp.data });
   toast.success("User created successfully");
   get().connectSocket();
  } catch (error) {
   if (error.response) {
    if (error.response.data.errors?.[0]?.msg) {
     return toast.error(error.response.data.errors[0].msg);
    }
    return toast.error(error.response.data.error);
   }
   toast.error(error.message);
  } finally {
   set({ isSigningUp: false });
  }
 },

 signin: async (data) => {
  toast.dismiss();
  set({ isSigningin: true });
  try {
   const resp = await axiosInstance.post("/auth/signin", data);
   set({ authUser: resp.data });
   toast.success("Logged in successfully");
   get().connectSocket();
  } catch (error) {
   if (error.response) {
    return toast.error(error.response.data.error);
   }
   toast.error(error.message);
  } finally {
   set({ isSigningin: false });
  }
 },

 signout: async () => {
  toast.dismiss();
  try {
   await axiosInstance.get("/auth/signout");
   set({ authUser: null });
   toast.success("Signed out successfully");
   get().disconnectSocket();
  } catch (error) {
   toast.error(error.message);
  }
 },

 updateProfile: async (data) => {
  toast.dismiss();
  set({ isUpdatingProfile: true });
  try {
   const resp = await axiosInstance.put("/user/update-pic", data);
   set({ authUser: resp.data });
   toast.success("Profile picture updated successfully");
  } catch (error) {
   if (error.response) {
    return toast.error(error.response.data.error);
   }
   toast.error(error.message);
  } finally {
   set({ isUpdatingProfile: false });
  }
 },
 connectSocket: () => {
  const { authUser } = get();
  if (!authUser || get().socket?.connected) {
   return;
  }
  const socket = io(import.meta.env.VITE_API_BASE_URL, {
   query: {
    userId: authUser._id,
   },
  });
  socket.connect();
  set({ socket: socket });
  socket.on("getOnlineUsers", (usersIds) => {
   set({ onlineUsers: usersIds });
  });
 },
 disconnectSocket: () => {
  if (get().socket?.connected) get().socket.disconnect();
 },
}));
