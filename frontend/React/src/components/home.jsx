import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:1010/display/${userId}`, { credentials: "include" })
      .then((res) => {
        if (res.status === 401) navigate("/login");
        return res.json();
      })
      .then((data) => setProfile(data))
      .catch((err) => console.error(err));
  }, [navigate]);

  const handleLogout = () => {
    fetch("http://localhost:1010/logout", {
      method: "POST",
      credentials: "include",
    })
      .then(() => {
        localStorage.removeItem("userId"); // clear stored id
        navigate("/");
      })
      .catch((err) => console.error(err));
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading profile...
      </div>
    );
  }
axios.get("http://localhost:1010/events/explore", { withCredentials: true })
  .then(res => setEvents(res.data))
  .catch(err => console.error(err));
  return (
    <div className="min-h-[90.5vh] bg-gradient-to-br from-[#8f94fb] to-[#4e54c8] text-gray-900 font-sans">
      <div className="flex justify-end w-full p-4">
        <div className="flex items-center gap-3">
          {profile?.profilePhoto && (
            <img
              src={`http://localhost:1010/uploads/${profile.profilePhoto}`}
              className="w-10 h-10 rounded-full object-cover"
              alt="profile"
            />
          )}
          <h3 className="font-bold">{profile?.username || "Guest"}</h3>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-6 p-6">
        {/* Sidebar */}
        <aside className="bg-white/90 rounded-xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.15)] sticky top-0 z-10 lg:static">
          <div className="font-extrabold tracking-wide mb-3">ATTEND</div>
          <nav className="flex flex-col">
            <div className="block mb-1.5 p-2.5 rounded-lg hover:bg-indigo-100 cursor-pointer" onClick={() => navigate("/home")}>Home</div>
            <div className="block mb-1.5 p-2.5 rounded-lg hover:bg-indigo-100 cursor-pointer" onClick={() => navigate("/host")}>Host</div>
            <div className="block mb-1.5 p-2.5 rounded-lg hover:bg-indigo-100 cursor-pointer" onClick={() => navigate("/book")}>Explore</div>
            <div className="block mb-1.5 p-2.5 rounded-lg hover:bg-indigo-100 cursor-pointer" onClick={() => navigate("/about")}>About Us</div>
            <div className="block mb-1.5 p-2.5 rounded-lg hover:bg-indigo-100 cursor-pointer" onClick={() => navigate("/help")}>Help</div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="bg-white/95 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
          <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
  {events.map((event) => (
    <div key={event._id} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
      {/* Event Image Container */}
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={`http://localhost:1010/uploads/${event.photo}`} 
          alt={event.eventname} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          Live
        </div>
      </div>

      {/* Event Details */}
      <div className="p-5">
        <h3 className="font-bold text-xl text-gray-800 mb-2 truncate">
          {event.eventname}
        </h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          Experience the best of {event.eventname} in Rwanda.
        </p>
        <button className="w-full py-2.5 bg-indigo-50 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-600 hover:text-white transition-colors">
          View Details
        </button>
      </div>
    </div>
  ))}
</section>

        </main>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-200 p-5">
        &copy; 2026 Attend Rwanda. All rights reserved.
      </footer>
    </div>
  );
}
