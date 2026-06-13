import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

export default function Book() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/events/explore`, { withCredentials: true })
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <button onClick={() => navigate("/home")} className="mb-6 text-indigo-600 font-bold">← Back</button>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Browse Events in Rwanda</h1>

      {events.length === 0 ? (
        <p className="text-gray-500 text-center py-16">No confirmed events available yet.</p>
      ) : (
        <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event._id}
              className="group bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
              onClick={() => navigate(`/detailEvent/${event._id}`)}
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={`${API_URL}/uploads/${event.photo}`}
                  alt={event.eventname}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  Confirmed
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-xl text-gray-800 mb-2 truncate">{event.eventname}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {event.eventdescription || `Experience ${event.eventname} in ${event.location}.`}
                </p>
                <button
                  className="w-full py-2.5 bg-indigo-50 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-600 hover:text-white transition-colors"
                  onClick={(e) => { e.stopPropagation(); navigate(`/detailEvent/${event._id}`); }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
