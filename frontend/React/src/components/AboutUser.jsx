import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/api";

export default function AboutUser({ profile }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout from Attend Rwanda?")) return;
    logout().then(() => navigate("/"));
  };

  if (!profile) return null;

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
      <div className="p-4 bg-indigo-600 text-white flex flex-col items-center gap-2">
        {profile.profilePhoto ? (
          <img
            src={`${API_URL}/uploads/${profile.profilePhoto}`}
            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
            alt="User"
          />
        ) : (
          <div className="w-16 h-16 bg-indigo-400 rounded-full flex items-center justify-center text-2xl font-bold border-2 border-white">
            {profile.username?.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="text-center">
          <p className="font-bold text-lg leading-tight">{profile.username}</p>
          <p className="text-xs opacity-80 capitalize">{user?.role || "user"}</p>
        </div>
      </div>

      <div className="p-2">
        <button className="w-full text-left p-3 text-sm hover:bg-indigo-50 rounded-xl flex items-center gap-3 text-gray-700 transition" onClick={() => navigate("/help")}>
          Help Center
        </button>
        <div className="h-[1px] bg-gray-100 my-1"></div>
        <button
          onClick={handleLogout}
          className="w-full text-left p-3 text-sm text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-3 font-bold transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
