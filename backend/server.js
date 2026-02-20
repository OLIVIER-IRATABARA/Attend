const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();

// ------------------ Upload Config ------------------
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname)
});

const photoUpload = multer({ storage });

// Middleware
app.use(express.json());
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}));
app.use("/uploads", express.static(uploadDir));
app.use(
  session({
    secret: "mySecretKey123",   // change in production
    resave: false,
    saveUninitialized: false,
    store: MongoStore.default.create({
  mongoUrl: "mongodb://127.0.0.1:27017/backend",
  collectionName: 'sessions'
    }),
    cookie: {
      httpOnly: true,
      secure: false,   // true in production (HTTPS)
      maxAge: 1000 * 60 * 2// 1 day
    }
  }))
// ------------------ MongoDB Connection ------------------
mongoose.connect("mongodb://127.0.0.1:27017/backend")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));

// ------------------ Schemas ------------------

// User Schema


const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: Number,
  password: String
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
  location: String
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);
// ------------------ Routes ------------------

// Root

app.get("/display", isAuthenticated, async (req, res) => {
  try {
    const data = await Second.findOne({ userId: req.session.userId })
      .populate("userId");

    res.json(data);

  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/display/:id", async (req, res) => {
  try {
    const data = await Second.findOne({ userId: req.params.id })
      .populate("userId");
      
    if (!data) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});


// CREATE user
app.post("/create", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json({ message: "continue to complete signup ", userId: user._id });
  } catch (err) {
    res.status(500).json(err);
  }
});
app.post("/profile/create", photoUpload.single("profilePhoto"), async (req, res) => {
  try {
    const { userId, username, bio,  location } = req.body;
    const profilePhoto = req.file ? req.file.filename : null;

    const profile = await Second.create({
      userId,
      profilePhoto,
      username,
      bio,
      location
    });

    res.json(profile);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out successfully" });
  });
});


// LOGIN user
app.post("/select", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({ message: "Login success", userId:user._id });
      req.session.userId= user._id;
      
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE user
app.put("/update/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE user
app.delete("/delete/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// ------------------ Event Routes ------------------

// CREATE Event
app.post("/events/create", photoUpload.single("photo"), async (req, res) => {
  try {
    const { eventname, eventdescription, event_date, event_time, location } = req.body;
    const photo = req.file ? req.file.filename : null;

    const event = await Event.create({
      eventname,
      eventdescription,
      photo,
      event_date,
      event_time,
      location
    });

    res.status(201).json({
      message: "Event created successfully",
      eventId: event._id,
      photoUrl: photo ? `http://localhost:1010/uploads/${photo}` : null
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}
app.get("/events/explore", async (req, res) => {
  try {
    const events = await Event.find({});
    res.json(events);
  } catch (err) {
    res.status(500).json(err);
  }
});
app.get("/events/explore/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json(err);
  }
});
// ------------------ Start Server ------------------
app.listen(1010, () =>
  console.log("Server started on http://localhost:1010")
);
