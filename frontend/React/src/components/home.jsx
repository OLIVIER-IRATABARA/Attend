import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AboutUser from "./AboutUser";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/api";

const NAV_BY_ROLE = {
  host: [
    { label: "Home", path: "/home" },
    { label: "Create Event", path: "/host" },
    { label: "My Events", path: "/my-events" },
    { label: "Browse Events", path: "/book" },
    { label: "About Us", path: "/about" },
    { label: "Help", path: "/help" }
  ],
  booker: [
    { label: "Home", path: "/home" },
    { label: "Browse Events", path: "/book" },
    { label: "My Bookings", path: "/my-bookings" },
    { label: "About Us", path: "/about" },
    { label: "Help", path: "/help" }
  ],
  confirmer: [
    { label: "Home", path: "/home" },
    { label: "Confirm Events", path: "/confirm" },
    { label: "Browse Events", path: "/book" },
    { label: "About Us", path: "/about" },
    { label: "Help", path: "/help" }
  ]
};

const ROLE_LABELS = { host: "Event Host", booker: "Booker", confirmer: "Event Confirmer" };

export default function Home() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [showProfileCard, setShowProfileCard] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }

    fetch(`${API_URL}/display/${user.userId}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error(err));
  }, [navigate, user, authLoading]);

  useEffect(() => {
    axios.get(`${API_URL}/events/explore`, { withCredentials: true })
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-indigo-600 text-xl font-bold">
        Loading...
      </div>
    );
  }

  const navItems = NAV_BY_ROLE[user.role] || NAV_BY_ROLE.booker;

  return (
    <div className="min-h-[100vh] bg-gradient-to-br from-[#8f94fb] to-[#4e54c8] text-gray-900 font-sans">
      <div className="flex justify-end w-full p-4 relative">
        <div className="flex items-center gap-3 bg-white/20 p-2 rounded-full px-4 backdrop-blur-md">
          <span className="text-xs text-white/80 font-medium hidden sm:inline">{ROLE_LABELS[user.role]}</span>
          <div
            className="cursor-pointer flex items-center gap-3 hover:opacity-80 transition"
            onClick={() => setShowProfileCard(!showProfileCard)}
          >
            {profile?.profilePhoto && (
              <img
                src={`${API_URL}/uploads/${profile.profilePhoto}`}
                className="w-10 h-10 rounded-full object-cover border-2 border-white"
                alt="profile"
              />
            )}
            <h3 className="font-bold text-white">{profile?.username || user.name || "User"}</h3>
          </div>
        </div>
        {showProfileCard && profile && <AboutUser profile={profile} />}
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-6 p-6">
        <aside className="bg-white/90 rounded-xl p-4 shadow-xl h-fit">
          <div className="font-extrabold tracking-wide mb-3 text-indigo-700">ATTEND RWANDA</div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <div
                key={item.path}
                className="p-2.5 rounded-lg hover:bg-indigo-100 cursor-pointer transition"
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </div>
            ))}
          </nav>
        </aside>

        <main className="bg-white/95 rounded-2xl p-6 shadow-xl min-h-[70vh]">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {user.role === "host" && "Confirmed Events in Rwanda"}
            {user.role === "booker" && "Discover Events"}
            {user.role === "confirmer" && "Live Events"}
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            {user.role === "host" && "Browse confirmed events. Use 'Create Event' to submit your own."}
            {user.role === "booker" && "Book tickets for confirmed events across Rwanda."}
            {user.role === "confirmer" && "Use 'Confirm Events' in the sidebar to review pending submissions."}
          </p>

          {events.length === 0 ? (
            <div className="text-center text-gray-500 py-16">No confirmed events yet. Check back soon!</div>
          ) : (
            <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <div key={event._id} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={`${API_URL}/uploads/${event.photo}`}
                      alt={event.eventname}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Confirmed
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-xl text-gray-800 mb-2 truncate">{event.eventname}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                      {event.eventdescription || `Experience ${event.eventname} in Rwanda.`}
                    </p>
                    <button
                      className="w-full py-2.5 bg-indigo-50 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-600 hover:text-white transition-colors"
                      onClick={() => navigate(`/detailEvent/${event._id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </section>
          )}
        </main>
      </div>

      <footer className="text-center text-gray-200 p-5">
        &copy; 2026 Attend Rwanda. All rights reserved.
      </footer>
    </div>
  );
}
