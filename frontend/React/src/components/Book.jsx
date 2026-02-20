import React, { useState } from 'react'
import axios from 'axios';

export default function Book() {
  const [events, setEvents] = useState([])
  axios.get("http://localhost:1010/events/explore", { withCredentials: true })
  .then(res => setEvents(res.data))
  .catch(err => console.error(err));
  return (
    <div>
        <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
  {events.map((event) => (
    <div key={event._id} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
    onClick={() => navigate(`/event/${event._id}`)}>
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
          Experience the best of {event.eventname} in {event.location}. <br />
        </p>
        <button className="w-full py-2.5 bg-green-300 text-indigo-700 font-semibold rounded-xl hover:bg-green-600 hover:text-white transition-colors"
         onClick={() => window.location.href = `/detailEvent/${event._id}`}>
          View Details
        </button>
      </div>
    </div>
  ))}
</section>

    </div>
  )
}
