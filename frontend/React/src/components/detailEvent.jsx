import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from 'react-router-dom';

export default function EventDetail() {
  const { id } = useParams(); 
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`https://attend-02uf.onrender.com/events/explore/${id}`, { withCredentials: true })
      .then(res => setEvent(res.data))
      .catch(err => console.error("Event not found", err));
  }, [id]);

  if (!event) return <div className="text-white text-center mt-20">Loading Event...</div>;
  console.log("Current event data:", event);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <button onClick={() => navigate(-1)} className="mb-6 text-indigo-600 font-bold">← Back</button>
      
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <img 
          src={`https://attend-02uf.onrender.com/uploads/${event.photo}`} 
          className="w-full h-96 object-cover" 
          alt={event.eventname} 
        />
        <div className="p-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{event.eventname}</h1>
          <div className="flex gap-4 mb-6">
            <span className="text-indigo-700 px-4 py-1 rounded-full text-sm font-semibold">
               {new Date(event.event_date).toLocaleDateString()} : {event.event_time}
            </span>
            <span className="bg-gray-100 text-green-700 px-4 py-1 rounded-full text-sm font-semibold">
               {event.location || "Rwanda"}
            </span>
          </div>
          
          {/* FIX 1: Removed button wrappers from text tags */}
          <p className="text-gray-600 leading-relaxed text-lg mb-8">
            {event.eventdescription || "Join us for this amazing event! Secure your tickets now to ensure your spot."}
          </p>

          {/* FIX 2 & 3: Used template literals for dynamic link path, and unnested the button */}
          <Link 
            to={`/BookingTicket/${event._id}`}
            className="block text-center w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg"
          >
            Book Tickets Now
          </Link>
        </div>
      </div>
    </div>
  );
}
