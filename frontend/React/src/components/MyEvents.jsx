import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config/api";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800"
};

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/events/mine`, { withCredentials: true })
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <button onClick={() => navigate("/home")} className="mb-6 text-indigo-600 font-bold">← Back to Home</button>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Events</h1>
        <button
          onClick={() => navigate("/host")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
        >
          + Create Event
        </button>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow">
          You have not created any events yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <div key={event._id} className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-4">
              {event.photo && (
                <img src={`${API_URL}/uploads/${event.photo}`} alt="" className="w-32 h-32 rounded-lg object-cover" />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-lg">{event.eventname}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[event.status]}`}>
                    {event.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1">{event.event_date} · {event.location}</p>
                {event.status === "rejected" && event.rejectionReason && (
                  <p className="text-red-600 text-sm mt-2">Reason: {event.rejectionReason}</p>
                )}
                {event.status === "pending" && (
                  <p className="text-yellow-700 text-sm mt-2">Waiting for a confirmer to approve this event.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
