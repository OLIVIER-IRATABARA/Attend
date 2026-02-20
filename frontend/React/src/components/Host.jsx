import React, { useState } from "react";

export default function Host() {
  const [eventname, setEventname] = useState("");
  const [eventdescription, setEventdescription] = useState("");
  const [event_date, setEventDate] = useState("");
  const [event_time, setEventTime] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ FormData is REQUIRED for files
    const formData = new FormData();
    formData.append("eventname", eventname);
    formData.append("eventdescription", eventdescription);
    formData.append("event_date", event_date);
    formData.append("event_time", event_time);
    formData.append("location", location);
    formData.append("photo", photo);

    fetch("http://localhost:1010/events/create", {
      method: "POST",
      body: formData, // ❌ NO headers here
    })
      .then((res) => res.json())
      .then((resData) => {
        alert(resData.message);
        setEventname("");
        setEventdescription("");
        setEventDate("");
        setEventTime("");
        setLocation("");
        setPhoto(null);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <button onClick={() => navigate(-1)} className="mb-6 text-indigo-600 font-bold">← Back</button>
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Host an Event</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Event Name */}
          <input
            type="text"
            value={eventname}
            onChange={(e) => setEventname(e.target.value)}
            placeholder="Event name"
            required
            className="w-full border p-2 rounded"
          />

          {/* Description */}
          <textarea
            value={eventdescription}
            onChange={(e) => setEventdescription(e.target.value)}
            placeholder="Event description"
            required
            className="w-full border p-2 rounded"
          />

          {/* Date */}
          <input
            type="date"
            value={event_date}
            onChange={(e) => setEventDate(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />

          {/* Time */}
          <input
            type="time"
            value={event_time}
            onChange={(e) => setEventTime(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />

          {/* Location */}
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            required
            className="w-full border p-2 rounded"
          />
        

          {/* ✅ Photo */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            required
            className="w-full"
          />
          

          <button className="w-full bg-indigo-600 text-white p-3 rounded">
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}
