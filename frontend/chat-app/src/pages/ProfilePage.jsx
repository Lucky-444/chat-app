import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfilePicture } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfilePicture({ profilePicture: base64Image });
    };
  };

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-base-100">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-base-300 rounded-xl p-6 sm:p-8 space-y-8 shadow-lg">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-base-content/70 mt-1">Manage your personal information</p>
          </div>

          {/* Profile Picture */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32">
              <img
                src={selectedImg || authUser?.profilePicture || "/avatar.png"}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-primary/20"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-primary p-2 rounded-full cursor-pointer hover:scale-105 transition 
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
              >
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400 text-center">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* User Info */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm text-zinc-500 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </label>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border text-base-content/80">
                {authUser?.fullname || "N/A"}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-zinc-500 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border text-base-content/80">
                {authUser?.email || "N/A"}
              </p>
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-base-200 rounded-xl p-5 sm:p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4 text-base-content">Account Information</h2>
            <div className="space-y-3 text-sm text-base-content/80">
              <div className="flex items-center justify-between py-2 border-b border-base-300">
                <span>Member Since</span>
                <span>{authUser?.createdAt?.split("T")[0] || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500 font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
