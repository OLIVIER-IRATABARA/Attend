import React, { useState } from "react";
import axios from "axios";

const BookingTicket = () => {
  const [category, setCategory] = useState("");
  const [fullname, setfullname] = useState("");
  const [Email, setEmail] = useState("");
  const [phone, setphone] = useState("");

  const handleBook = (e) => {
    e.preventDefault();
    
    // Simple validation before sending
    if (!category) {
      alert("Please select a ticket category.");
      return;
    }

    axios.post('https://attend-02uf.onrender.com/book/ticket', { category, fullname, Email, phone })
      .then((res) => {
        alert("Booking successfully submitted!");
        // Clear form after success
        setCategory("");
        setfullname("");
        setEmail("");
        setphone("");
      })
      .catch((err) => {
        console.log('Failed to book ticket', err);
        alert("Booking failed. Please try again.");
      });
  };

  // FIX 1: Removed the broken "if (!fullname)" loading check so the form can actually render

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl p-6">
        
        {/* FIX 2: Wrapped the entire grid layout inside the form tag so all buttons can submit */}
        <form onSubmit={handleBook} className="grid md:grid-cols-2 gap-6">
          
          {/* LEFT SIDE - DETAILS */}
          <div>
            <h2 className="text-blue-700 text-2xl font-bold text-center mb-4">
              Book Your Ticket
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-blue-700 font-semibold">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={fullname}
                  onChange={(e) => { setfullname(e.target.value); }}
                  required
                  className="w-full border border-blue-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-blue-700 font-semibold">Email</label>
                <input
                  type="email"
                  placeholder="book@gmail.com"
                  value={Email}
                  onChange={(e) => { setEmail(e.target.value); }}
                  required
                  className="w-full border border-blue-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-blue-700 font-semibold">Phone</label>
                <input
                  type="tel"
                  placeholder="078xxxxxxx"
                  value={phone}
                  onChange={(e) => { setphone(e.target.value); }}
                  required
                  className="w-full border border-blue-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="text-blue-700 font-semibold">
                  Ticket Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full border border-blue-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose Category...</option>
                  <option value="Regular">Regular</option>
                  <option value="VIP">VIP</option>
                  <option value="VVIP">VVIP</option>
                </select>
                <p className="text-blue-600 mt-1 text-sm">
                  Selected: {category}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - PAYMENT */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-blue-700 text-xl font-bold mb-4 text-center">
                Payment Method
              </h3>

              {/* Note: changed these to type="button" so they do not accidentally submit the form early */}
              <div className="space-y-3">
                <button type="button" className="w-full bg-blue-700 text-white p-2 rounded hover:bg-blue-500 transition">
                  Mobile Money
                </button>

                <button type="button" className="w-full bg-blue-700 text-white p-2 rounded hover:bg-blue-500 transition">
                  Debit / Credit Card
                </button>

                <button type="button" className="w-full bg-blue-700 text-white p-2 rounded hover:bg-blue-500 transition">
                  Internet Banking
                </button>
              </div>
            </div>

            {/* This button will now properly trigger handleBook */}
            <button type="submit" className="mt-6 w-full bg-blue-800 text-white font-bold p-3 rounded hover:bg-blue-600 transition">
              BOOK TICKET NOW
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default BookingTicket;
