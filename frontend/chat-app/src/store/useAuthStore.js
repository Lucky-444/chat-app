import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
const BASE_URL = "http://localhost:3000"

export const useAuthStore = create((set  , get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile : false,
  isCheckingAuth: true,
   onlineUsers: [],
   socket : null,

  // Check if user is authenticated
  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data.user });
       get().connectSocket()
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Signup handler
  signup: async (data) => {
    set({ isSigningUp: true });

    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data.user });
      toast.success("Account created successfully!");
       get().connectSocket()
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  // : login handler (add your login route logic if needed)
  login: async (data) => {
    set({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data.user });
      console.log(res.data.user);
      
      toast.success("Logged in successfully!");

      get().connectSocket()
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },
  //simple logout function
  logout: async (params) => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("successFully Logged out");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error?.response?.data?.message || "logout failed");
    }
  },

  //now update the profile picture of the user
  updateProfilePicture: async (data) =>{
      set({isUpdatingProfile : true});
      try {
        const res = await axiosInstance.put("/auth/update-profile", data);
        set({ authUser: res.data.user });
        toast.success("Profile picture updated successfully!");
      }catch(error){
        console.error(error);
        toast.error(error?.response?.data?.message || "Failed to update profile picture");
      }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },

  
}));
