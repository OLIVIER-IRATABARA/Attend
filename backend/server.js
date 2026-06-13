require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo").MongoStore;
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 10000;

const rawMongoUrl = process.env.MONGODB_URL || "";
const mongoUrl = rawMongoUrl
  .trim()
  .replace(/^['"](.+)['"];?$/, "$1")
  .replace(/;$/, "");

if (!mongoUrl) {
  console.error("MONGODB_URL is required and must start with mongodb:// or mongodb+srv://");
  process.exit(1);
}

mongoose.connect(mongoUrl)
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch(err => console.log("MongoDB connection error:", err));

const allowedOrigins = [
  "https://attend-1-w4fe.onrender.com",
  "http://localhost:5173"
];

app.use(express.json());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(`Blocked by CORS for origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  }
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.options("*splat", cors());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "mySecretKey123",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl,
      collectionName: "sessions"
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------ Auth middleware ------------------

function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized — please log in" });
  }
}

function requireRole(...roles) {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (!roles.includes(user.role || "booker")) {
        return res.status(403).json({
          message: `Access denied. This action requires one of: ${roles.join(", ")}`
        });
      }
      req.user = user;
      next();
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  };
}

// ------------------ Schemas ------------------

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const photoUpload = multer({ storage });

const ROLES = ["host", "booker", "confirmer"];

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  role: { type: String, enum: ROLES, default: "booker" }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

const secondSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  profilePhoto: String,
  username: String,
  bio: String,
  location: String
});

const Second = mongoose.model("SecondUser", secondSchema);

const eventSchema = new mongoose.Schema({
  eventname: String,
  eventdescription: String,
  photo: String,
  event_date: String,
  event_time: String,
  location: String,
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["pending", "confirmed", "rejected"],
    default: "pending"
  },
  confirmedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  confirmedAt: Date,
  rejectionReason: String
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);

const ContHost = new mongoose.Schema({
  CostID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true
  },
  firstclass: Number,
  secondclass: Number,
  thirdclass: Number
});

const finhost = mongoose.model("conthosts", ContHost);

const BookSchema = new mongoose.Schema({
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true
  },
  bookerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  category: String,
  fullname: String,
  Email: String,
  phone: String,
  amount: Number,
  paymentStatus: { type: String, default: "pending" },
  transactionReference: String,
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending"
  }
});

const book = mongoose.model("Bookings", BookSchema);

const CATEGORY_MAP = {
  Regular: "firstclass",
  VIP: "secondclass",
  VVVIP: "thirdclass"
};

// ------------------ User routes ------------------

app.get("/display", isAuthenticated, async (req, res) => {
  try {
    const data = await Second.findOne({ userId: req.session.userId }).populate("userId");
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/display/:id", async (req, res) => {
  try {
    const data = await Second.findOne({ userId: req.params.id }).populate("userId");
    if (!data) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/me", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/create", async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    if (role && !ROLES.includes(role)) {
      return res.status(400).json({ message: `Role must be one of: ${ROLES.join(", ")}` });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }
    const user = await User.create({ name, email, phone, password, role: role || "booker" });
    res.json({ message: "Account created — complete your profile", userId: user._id, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/profile/create", photoUpload.single("profilePhoto"), async (req, res) => {
  try {
    const { userId, username, bio, location } = req.body;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Valid userId is required" });
    }
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }
    const profilePhoto = req.file ? req.file.filename : null;
    const profile = await Second.create({ userId, profilePhoto, username, bio, location });
    res.status(201).json({ message: "Profile created successfully", profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out successfully" });
  });
});

app.post("/select", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    req.session.userId = user._id;
    req.session.role = user.role || "booker";
    res.json({
      message: "Login success",
      userId: user._id,
      role: user.role || "booker",
      name: user.name
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/update/:id", isAuthenticated, async (req, res) => {
  try {
    if (req.params.id !== req.session.userId.toString()) {
      return res.status(403).json({ message: "You can only update your own account" });
    }
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/delete/:id", isAuthenticated, async (req, res) => {
  try {
    if (req.params.id !== req.session.userId.toString()) {
      return res.status(403).json({ message: "You can only delete your own account" });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------ Event routes ------------------

app.post("/events/create", isAuthenticated, requireRole("host"), photoUpload.single("photo"), async (req, res) => {
  try {
    const { eventname, eventdescription, event_date, event_time, location } = req.body;
    const photo = req.file ? req.file.filename : null;

    const event = await Event.create({
      eventname,
      eventdescription,
      photo,
      event_date,
      event_time,
      location,
      hostId: req.session.userId,
      status: "pending"
    });

    res.status(201).json({
      message: "Event submitted for confirmation. A confirmer will review it soon.",
      eventId: event._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/events/createcont", isAuthenticated, requireRole("host"), async (req, res) => {
  try {
    const { eventId, firstclass, secondclass, thirdclass } = req.body;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (event.hostId.toString() !== req.session.userId.toString()) {
      return res.status(403).json({ message: "You can only set prices for your own events" });
    }

    const existing = await finhost.findOne({ CostID: eventId });
    if (existing) {
      existing.firstclass = firstclass;
      existing.secondclass = secondclass;
      existing.thirdclass = thirdclass;
      await existing.save();
    } else {
      await finhost.create({ CostID: eventId, firstclass, secondclass, thirdclass });
    }

    res.status(200).json({ message: "Ticket prices saved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/events/explore", async (req, res) => {
  try {
    const events = await Event.find({ status: "confirmed" });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/events/mine", isAuthenticated, requireRole("host"), async (req, res) => {
  try {
    const events = await Event.find({ hostId: req.session.userId }).sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/events/pending", isAuthenticated, requireRole("confirmer"), async (req, res) => {
  try {
    const events = await Event.find({ status: "pending" })
      .populate("hostId", "name email phone")
      .sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch("/events/:id/confirm", isAuthenticated, requireRole("confirmer"), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.status !== "pending") {
      return res.status(400).json({ message: "Event is not pending review" });
    }

    event.status = "confirmed";
    event.confirmedBy = req.session.userId;
    event.confirmedAt = new Date();
    await event.save();

    res.json({ message: "Event confirmed and now visible to bookers", event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch("/events/:id/reject", isAuthenticated, requireRole("confirmer"), async (req, res) => {
  try {
    const { reason } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.status !== "pending") {
      return res.status(400).json({ message: "Event is not pending review" });
    }

    event.status = "rejected";
    event.rejectionReason = reason || "Event did not meet requirements";
    event.confirmedBy = req.session.userId;
    event.confirmedAt = new Date();
    await event.save();

    res.json({ message: "Event rejected", event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/events/explore/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.status !== "confirmed") {
      return res.status(404).json({ message: "Event not available" });
    }

    const pricing = await finhost.findOne({ CostID: req.params.id });
    res.json({
      ...event.toObject(),
      firstclass: pricing ? pricing.firstclass : null,
      secondclass: pricing ? pricing.secondclass : null,
      thirdclass: pricing ? pricing.thirdclass : null
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------ Booking routes ------------------

app.post("/book/ticket/:id", isAuthenticated, requireRole("booker"), async (req, res) => {
  try {
    const { category, fullname, Email, phone, paymentMethod } = req.body;
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event || event.status !== "confirmed") {
      return res.status(400).json({ message: "This event is not available for booking" });
    }

    const pricing = await finhost.findOne({ CostID: id });
    const priceField = CATEGORY_MAP[category];
    let amount = pricing && priceField ? pricing[priceField] : null;

    if (!amount) {
      const defaults = { Regular: 10000, VIP: 25000, VVVIP: 50000 };
      amount = defaults[category] || 10000;
    }

    const transactionRef = `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    if (paymentMethod === "momo") {
      try {
        await axios.post(
          "https://api.flutterwave.com/v3/charges?type=mobile_money_rwanda",
          {
            tx_ref: transactionRef,
            amount,
            currency: "RWF",
            network: "MTN",
            email: Email,
            phone_number: phone,
            fullname
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`
            }
          }
        );
      } catch (paymentErr) {
        console.error("Payment gateway error:", paymentErr.response?.data || paymentErr.message);
      }
    }

    const booking = await book.create({
      ticketId: id,
      bookerId: req.session.userId,
      category,
      fullname,
      Email,
      phone,
      amount,
      paymentStatus: paymentMethod === "momo" ? "pending" : "completed",
      transactionReference: transactionRef,
      status: "confirmed"
    });

    res.status(200).json({
      message: "Booking confirmed! Check your phone for MoMo prompt if paying via Mobile Money.",
      reference: transactionRef,
      bookingId: booking._id,
      amount
    });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Booking failed" });
  }
});

app.get("/bookings/mine", isAuthenticated, requireRole("booker"), async (req, res) => {
  try {
    const bookings = await book.find({ bookerId: req.session.userId })
      .populate("ticketId", "eventname event_date event_time location photo")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/events/:id/bookings", isAuthenticated, requireRole("host"), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.hostId.toString() !== req.session.userId.toString()) {
      return res.status(403).json({ message: "You can only view bookings for your own events" });
    }

    const bookings = await book.find({ ticketId: req.params.id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server started on http://localhost:${PORT}`)
);
