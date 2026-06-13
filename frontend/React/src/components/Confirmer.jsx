import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config/api";

export default function Confirmer() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadPending = () => {
    axios
      .get(`${API_URL}/events/pending`, { withCredentials: true })
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPending();
  }, []);

  const confirmEvent = (id) => {
    axios
      .patch(`${API_URL}/events/${id}/confirm`, {}, { withCredentials: true })
      .then(() => {
        alert("Event confirmed — it is now visible to bookers.");
        loadPending();
      })
      .catch((err) => alert(err.response?.data?.message || "Failed to confirm"));
  };

  const rejectEvent = (id) => {
    const reason = prompt("Reason for rejection (optional):");
    axios
      .patch(`${API_URL}/events/${id}/reject`, { reason }, { withCredentials: true })
      .then(() => {
        alert("Event rejected.");
        loadPending();
      })
      .catch((err) => alert(err.response?.data?.message || "Failed to reject"));
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-indigo-600 font-bold">Loading pending events...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <button onClick={() => navigate("/home")} className="mb-6 text-indigo-600 font-bold">← Back to Home</button>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Confirm Events</h1>
      <p className="text-gray-600 mb-8">Review events submitted by hosts in Rwanda. Confirm valid events so bookers can see them.</p>

      {events.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow">No events waiting for confirmation.</div>
      ) : (
        <div className="grid gap-6">
          {events.map((event) => (
            <div key={event._id} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
              {event.photo && (
                <img
                  src={`${API_URL}/uploads/${event.photo}`}
                  alt={event.eventname}
                  className="md:w-64 h-48 md:h-auto object-cover"
                />
              )}
              <div className="p-6 flex-1">
                <h2 className="text-2xl font-bold text-gray-800">{event.eventname}</h2>
                <p className="text-sm text-indigo-600 mt-1">
                  Host: {event.hostId?.name} ({event.hostId?.email})
                </p>
                <p className="text-gray-600 mt-3">{event.eventdescription}</p>
                <div className="flex flex-wrap gap-3 mt-4 text-sm">
                  <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">{event.event_date} at {event.event_time}</span>
                  <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">{event.location}</span>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => confirmEvent(event._id)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                  >
                    Confirm Event
                  </button>
                  <button
                    onClick={() => rejectEvent(event._id)}
                    className="px-6 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
