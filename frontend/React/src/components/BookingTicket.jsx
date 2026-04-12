import React, { useState } from "react";

const BookingTicket = () => {
  const [category, setCategory] = useState("");

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
      
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl p-6 grid md:grid-cols-2 gap-6">
        
        
        <div>
          <h2 className="text-blue-700 text-2xl font-bold text-center mb-4">
            Book Your Ticket
          </h2>

          <form className="space-y-4">
            <div>
              <label className="text-blue-700 font-semibold">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full border border-blue-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-blue-700 font-semibold">Email</label>
              <input
                type="email"
                placeholder="book@gmail.com"
                className="w-full border border-blue-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-blue-700 font-semibold">Phone</label>
              <input
                type="tel"
                placeholder="078xxxxxxx"
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
          </form>
        </div>

        {/* RIGHT SIDE - PAYMENT */}
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-blue-700 text-xl font-bold mb-4 text-center">
              Payment Method
            </h3>

            <div className="space-y-3">
              <button className="w-full bg-blue-700 text-white p-2 rounded hover:bg-blue-500 transition">
                Mobile Money
              </button>

              <button className="w-full bg-blue-700 text-white p-2 rounded hover:bg-blue-500 transition">
                Debit / Credit Card
              </button>

              <button className="w-full bg-blue-700 text-white p-2 rounded hover:bg-blue-500 transition">
                Internet Banking
              </button>
            </div>
          </div>

          
          <button className="mt-6 w-full bg-blue-800 text-white font-bold p-3 rounded hover:bg-blue-600 transition">
            BOOK TICKET NOW
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookingTicket;