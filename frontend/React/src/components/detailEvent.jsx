import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/api";

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    axios
      .get(`${API_URL}/events/explore/${id}`, { withCredentials: true })
      .then((res) => setEvent(res.data))
      .catch(() => navigate("/book"));
  }, [id, navigate]);

  if (!event) {
    return <div className="min-h-screen flex items-center justify-center text-indigo-600 font-bold">Loading Event...</div>;
  }

  const canBook = user?.role === "booker";

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <button onClick={() => navigate(-1)} className="mb-6 text-indigo-600 font-bold">← Back</button>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <img
          src={`${API_URL}/uploads/${event.photo}`}
          className="w-full h-96 object-cover"
          alt={event.eventname}
        />
        <div className="p-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{event.eventname}</h1>
          <div className="flex gap-4 mb-6 flex-wrap">
            <span className="text-indigo-700 px-4 py-1 rounded-full text-sm font-semibold bg-indigo-50">
              {new Date(event.event_date).toLocaleDateString()} : {event.event_time}
            </span>
            <span className="bg-gray-100 text-green-700 px-4 py-1 rounded-full text-sm font-semibold">
              {event.location || "Rwanda"}
            </span>
          </div>

          <p className="text-gray-600 leading-relaxed text-lg mb-6">
            {event.eventdescription || "Join us for this amazing event in Rwanda!"}
          </p>

          {(event.firstclass || event.secondclass || event.thirdclass) && (
            <div className="bg-indigo-50 rounded-xl p-5 mb-8">
              <h3 className="font-bold text-indigo-800 mb-3">Ticket Prices (RWF)</h3>
              <div className="grid sm:grid-cols-3 gap-3 text-sm">
                {event.firstclass != null && (
                  <div className="bg-white p-3 rounded-lg"><strong>Regular:</strong> {Number(event.firstclass).toLocaleString()} RWF</div>
                )}
                {event.secondclass != null && (
                  <div className="bg-white p-3 rounded-lg"><strong>VIP:</strong> {Number(event.secondclass).toLocaleString()} RWF</div>
                )}
                {event.thirdclass != null && (
                  <div className="bg-white p-3 rounded-lg"><strong>VVVIP:</strong> {Number(event.thirdclass).toLocaleString()} RWF</div>
                )}
              </div>
            </div>
          )}

          {canBook ? (
            <Link
              to={`/BookingTicket/${event._id}`}
              className="block text-center w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg"
            >
              Book Tickets Now
            </Link>
          ) : user ? (
            <p className="text-center text-gray-500 py-4 bg-gray-100 rounded-xl">
              Only booker accounts can purchase tickets. You are signed in as <strong>{user.role}</strong>.
            </p>
          ) : (
            <Link
              to="/login"
              className="block text-center w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700"
            >
              Login as Booker to Book Tickets
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
