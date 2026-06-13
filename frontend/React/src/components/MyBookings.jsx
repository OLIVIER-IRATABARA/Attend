import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config/api";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/bookings/mine`, { withCredentials: true })
      .then((res) => setBookings(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <button onClick={() => navigate("/home")} className="mb-6 text-indigo-600 font-bold">← Back to Home</button>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow">
          No bookings yet. <button onClick={() => navigate("/book")} className="text-indigo-600 font-semibold ml-1">Browse events</button>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((b) => (
            <div key={b._id} className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center gap-4">
              {b.ticketId?.photo && (
                <img src={`${API_URL}/uploads/${b.ticketId.photo}`} alt="" className="w-24 h-24 rounded-lg object-cover" />
              )}
              <div className="flex-1">
                <h3 className="font-bold text-lg">{b.ticketId?.eventname || "Event"}</h3>
                <p className="text-gray-600 text-sm">{b.ticketId?.event_date} · {b.ticketId?.location}</p>
                <p className="text-sm mt-1">{b.category} — {b.amount?.toLocaleString()} RWF</p>
                <p className="text-xs text-gray-400 mt-1">Ref: {b.transactionReference}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                b.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              }`}>
                {b.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
