require("dotenv").config(); // 1. Load your secret variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo").MongoStore;

const app = express();
const PORT = process.env.PORT || 1010; // Use Render's port or 1010 locally

const rawMongoUrl = process.env.MONGODB_URL || "";
const mongoUrl = rawMongoUrl
  .trim()
  .replace(/^['"](.+)['"];?$/, "$1")
  .replace(/;$/, "");

if (!mongoUrl) {
  console.error("MONGODB_URL is required and must start with mongodb:// or mongodb+srv://");
  process.exit(1);
}

// ------------------ MongoDB Connection ------------------
// This must happen BEFORE the session store is created
mongoose.connect(mongoUrl)
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// ------------------ Middleware ------------------
app.use(express.json());
// 1. Clean the Frontend URL (Add this near your mongoUrl logic)
const rawFrontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const cleanFrontendUrl = rawFrontendUrl
  .trim()
  .replace(/^['"](.+)['"];?$/, "$1") // Removes quotes
  .replace(/;$/, "");                // Removes trailing semicolon

// 2. Use the CLEANED variable in CORS
app.use(cors({
  origin: cleanFrontendUrl, 
  credentials: true
}));


app.use(
  session({
    secret: process.env.SESSION_SECRET || "mySecretKey123",
    resave: false,
    saveUninitialized: false,
    // NEW WAY
store: MongoStore.create({ 
  mongoUrl,
  collectionName: 'sessions'
}),

    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure only in production
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  })
);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ------------------ Schemas ------------------

// User Schema
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const photoUpload = multer({ storage });

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
  location: String,
  
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);
// ------------------ Routes ------------------
const ContHost = new mongoose.Schema({
  CostID:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Event",
    require: true
  },
  firstclass: Number,
  secondclass: Number,
  thirdclass: Number

})
const finhost = mongoose.model("conthosts",ContHost)
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
    const { userId, username, bio, location } = req.body;
    
    // Validate userId exists
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // Validate userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const profilePhoto = req.file ? req.file.filename : null;

    const profile = await Second.create({
      userId,
      profilePhoto,
      username,
      bio,
      location
    });

    console.log("Profile created successfully:", profile._id);
    res.status(201).json({ 
      message: "Profile created successfully",
      profile 
    });
  } catch (err) {
    console.error("Profile creation error:", err);
    res.status(500).json({ 
      message: "Error creating profile", 
      error: err.message 
    });
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
    req.session.userId= user._id;
    res.json({ message: "Login success", userId:user._id });
      
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
      location,
      
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
app.post("/events/createcont", async (req, res) => {
  const { eventId, firstclass, secondclass, thirdclass } = req.body; // Add eventId here
  const data = new finhost({
      CostID: eventId, // Map the event to the prices
      firstclass,
      secondclass,
      thirdclass
  });
const result = await data.save()
if(result){
  res.status(200).json({message:"costs well created"})
}
else{
  res.status(400).json()
}
})
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
    // 1. Find the basic event details
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 2. Find the pricing details where CostID matches this event's ID
    const pricing = await finhost.findOne({ CostID: req.params.id });

    // 3. Combine them into one object
    const eventWithPricing = {
      ...event._doc, // Spreads the event data
      firstclass: pricing ? pricing.firstclass : "N/A",
      secondclass: pricing ? pricing.secondclass : "N/A",
      thirdclass: pricing ? pricing.thirdclass : "N/A",
    };

    res.json(eventWithPricing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------ Start Server ------------------
app.listen(PORT, () =>
  console.log(`Server started on http://localhost:${PORT}`)
);
