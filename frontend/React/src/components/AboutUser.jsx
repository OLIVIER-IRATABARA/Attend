import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AboutUser({ profile }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Confirmation Message
    const confirmLogout = window.confirm("Are you sure you want to logout from Attend Rwanda?");
    
    if (confirmLogout) {
      fetch('http://localhost:1010/logout', { 
        method: 'POST', 
        credentials: 'include' 
      })
      .then(() => {
        localStorage.removeItem('userId');
        navigate('/');
      })
      .catch((err) => console.error("Logout failed:", err));
    }
  };

  if (!profile) return null;

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
      {/* Header with Real Profile Photo */}
      <div className="p-4 bg-indigo-600 text-white flex flex-col items-center gap-2">
        {profile.profilePhoto ? (
          <img 
            src={`http://localhost:1010/uploads/${profile.profilePhoto}`} 
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
          <p className="text-xs opacity-80">{profile.email || "No email provided"}</p>
        </div>
      </div>

      {/* Menu Links */}
      <div className="p-2">
        <button className="w-full text-left p-3 text-sm hover:bg-indigo-50 rounded-xl flex items-center gap-3 text-gray-700 transition" onClick={() => navigate('/settings')}>
          ⚙️ Account Settings
        </button>
        <button className="w-full text-left p-3 text-sm hover:bg-indigo-50 rounded-xl flex items-center gap-3 text-gray-700 transition" onClick={() => navigate('/help')}>
          ❓ Help Center
        </button>
        
        <div className="h-[1px] bg-gray-100 my-1"></div>
        
        {/* Red Logout with Confirmation */}
        <button 
          onClick={handleLogout}
          className="w-full text-left p-3 text-sm text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-3 font-bold transition"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
