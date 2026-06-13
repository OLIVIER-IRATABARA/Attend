import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

const BookingTicket = () => {
  const [category, setCategory] = useState("");
  const [fullname, setfullname] = useState("");
  const [Email, setEmail] = useState("");
  const [phone, setphone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [loading, setLoading] = useState(false);
  const [pricing, setPricing] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/events/explore/${id}`, { withCredentials: true })
      .then((res) => setPricing(res.data))
      .catch(() => alert("Event not available for booking"));
  }, [id]);

  const getPrice = (cat) => {
    if (!pricing) return null;
    const map = { Regular: pricing.firstclass, VIP: pricing.secondclass, VVVIP: pricing.thirdclass };
    return map[cat];
  };

  const handleBook = (e) => {
    e.preventDefault();
    if (!category) {
      alert("Please select a ticket category.");
      return;
    }

    setLoading(true);

    axios
      .post(
        `${API_URL}/book/ticket/${id}`,
        { category, fullname, Email, phone, paymentMethod },
        { withCredentials: true }
      )
      .then((res) => {
        setLoading(false);
        if (paymentMethod === "momo") {
          alert("Payment request sent! Check your phone for the MTN/Airtel MoMo prompt.");
        } else {
          alert("Booking successfully submitted!");
        }
        navigate("/my-bookings");
      })
      .catch((err) => {
        setLoading(false);
        alert(err.response?.data?.message || "Booking failed. Please try again.");
      });
  };

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl p-6">
        <form onSubmit={handleBook} className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-blue-700 text-2xl font-bold text-center mb-4">Book Your Ticket</h2>
            <div className="space-y-4">
              <div>
                <label className="text-blue-700 font-semibold">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={fullname}
                  required
                  onChange={(e) => setfullname(e.target.value)}
                  className="w-full border border-blue-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-blue-700 font-semibold">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={Email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-blue-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-blue-700 font-semibold">Phone (MoMo — 078xxxxxxx)</label>
                <input
                  type="tel"
                  placeholder="078xxxxxxx"
                  value={phone}
                  required
                  onChange={(e) => setphone(e.target.value)}
                  className="w-full border border-blue-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-blue-700 font-semibold">Ticket Category</label>
                <select
                  value={category}
                  required
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-blue-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose Category...</option>
                  {pricing?.firstclass != null && (
                    <option value="Regular">Regular ({Number(pricing.firstclass).toLocaleString()} RWF)</option>
                  )}
                  {pricing?.secondclass != null && (
                    <option value="VIP">VIP ({Number(pricing.secondclass).toLocaleString()} RWF)</option>
                  )}
                  {pricing?.thirdclass != null && (
                    <option value="VVVIP">VVVIP ({Number(pricing.thirdclass).toLocaleString()} RWF)</option>
                  )}
                  {!pricing?.firstclass && !pricing?.secondclass && !pricing?.thirdclass && (
                    <>
                      <option value="Regular">Regular (10,000 RWF)</option>
                      <option value="VIP">VIP (25,000 RWF)</option>
                      <option value="VVVIP">VVVIP (50,000 RWF)</option>
                    </>
                  )}
                </select>
                {category && getPrice(category) && (
                  <p className="text-sm text-gray-500 mt-1">Total: {Number(getPrice(category)).toLocaleString()} RWF</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-blue-700 text-xl font-bold mb-4 text-center">Payment Method</h3>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("momo")}
                  className={`w-full p-2 rounded transition font-medium border ${paymentMethod === "momo" ? "bg-yellow-400 text-black border-yellow-500" : "bg-blue-700 text-white border-transparent hover:bg-blue-500"}`}
                >
                  MTN / Airtel Mobile Money
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`w-full p-2 rounded transition font-medium border ${paymentMethod === "card" ? "bg-indigo-600 text-white border-indigo-700" : "bg-blue-700 text-white border-transparent hover:bg-blue-500"}`}
                >
                  Debit / Credit Card
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full bg-blue-800 text-white font-bold p-3 rounded hover:bg-blue-600 transition disabled:bg-gray-400"
            >
              {loading ? "PROCESSING..." : "BOOK & PAY NOW"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingTicket;
