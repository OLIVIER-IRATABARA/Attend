import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const BookingTicket = () => {
  const [category, setCategory] = useState("");
  const [fullname, setfullname] = useState("");
  const [Email, setEmail] = useState("");
  const [phone, setphone] = useState("");
  
  // Track payment selections (e.g., 'momo', 'card')
  const [paymentMethod, setPaymentMethod] = useState("momo"); 
  const [loading, setLoading] = useState(false);
  const { id } = useParams(); 

  const handleBook = (e) => {
    e.preventDefault();
    
    if (!category) {
      alert("Please select a ticket category.");
      return;
    }

    setLoading(true);

    // Send paymentMethod along with user information
    axios.post(`https://attend-02uf.onrender.com/{id}`, { 
      category, 
      fullname, 
      Email, 
      phone,
      paymentMethod 
    })
      .then((res) => {
        setLoading(false);
        // If MoMo is picked, alert user to check their device screen
        if (paymentMethod === "momo") {
          alert("Payment request sent! Please check your phone for the MTN/Airtel USSD prompt to enter your PIN.");
        } else {
          alert("Booking successfully submitted!");
        }
        setCategory("");
        setfullname("");
        setEmail("");
        setphone("");
      })
      .catch((err) => {
        setLoading(false);
        console.error('Failed to book ticket', err);
        alert(err.response?.data?.message || "Booking and payment failed. Please try again.");
      });
  };

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl p-6">
        
        <form onSubmit={handleBook} className="grid md:grid-cols-2 gap-6">
          
          {/* LEFT SIDE - DETAILS */}
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
                  placeholder="book@gmail.com"
                  value={Email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-blue-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-blue-700 font-semibold">Phone (for MoMo Cashout)</label>
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
                  <option value="Regular">Regular (10,000 RWF)</option>
                  <option value="VIP">VIP (25,000 RWF)</option>
                  <option value="VVIP">VVIP (50,000 RWF)</option>
                </select>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - PAYMENT */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-blue-700 text-xl font-bold mb-4 text-center">Payment Method</h3>

              <div className="space-y-3">
                <button 
                  type="button" 
                  onClick={() => setPaymentMethod("momo")}
                  className={`w-full p-2 rounded transition font-medium border ${paymentMethod === 'momo' ? 'bg-yellow-400 text-black border-yellow-500' : 'bg-blue-700 text-white border-transparent hover:bg-blue-500'}`}
                >
                  MTN / Airtel Mobile Money
                </button>

                <button 
                  type="button" 
                  onClick={() => setPaymentMethod("card")}
                  className={`w-full p-2 rounded transition font-medium border ${paymentMethod === 'card' ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-blue-700 text-white border-transparent hover:bg-blue-500'}`}
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
              {loading ? "PROCESSING PAYMENT..." : "BOOK & PAY NOW"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default BookingTicket;
