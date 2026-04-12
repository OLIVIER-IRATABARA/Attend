import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {Link} from 'react-router-dom'

export default function EventDetail() {
  const { id } = useParams(); // Gets the ID from the URL
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:1010/events/explore/${id}`, { withCredentials: true })
      .then(res => setEvent(res.data))
      .catch(err => console.error("Event not found", err));
  }, [id]);

  if (!event) return <div className="text-white text-center mt-20">Loading Event...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <button onClick={() => navigate(-1)} className="mb-6 text-indigo-600 font-bold">← Back</button>
      
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <img 
          src={`http://localhost:1010/uploads/${event.photo}`} 
          className="w-full h-96 object-cover" 
          alt={event.eventname} 
        />
        <div className="p-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{event.eventname}</h1>
          <div className="flex gap-4 mb-6">
            <span className="text-indigo-700 px-4 py-1 rounded-full text-sm font-semibold">
               {new Date(event.event_date).toLocaleDateString()} : {event.event_time}
            </span>
            <span className="bg-black-400 text-green-700 px-4 py-1 rounded-full text-sm font-semibold">
               {event.location || "Rwanda"}
            </span>
          </div>
          <p className="text-gray-600 leading-relaxed text-lg">
            {event.eventdescription || "Join us for this amazing event! Secure your tickets now to ensure your spot."}
          </p>
          <button className="mt-8 w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg"><Link to="/BookingTicket">
            Book Tickets Now
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}
