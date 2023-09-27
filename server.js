import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import session from "express-session";
import bcrypt from "bcrypt";

const app = express();
// const port = 3000;

//!  Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// ! Configure express-session middleware
app.use(
  session({
    secret: "a3Rv2z9$Bc#FkP!qY*Thm@JpLmNnQrSvX",
    resave: false,
    saveUninitialized: true,
  })
);
let uri =
  "mongodb+srv://msabhithakur7777:MSabhi@cluster0.f7was8z.mongodb.net/?retryWrites=true&w=majority";
//! Connecting to the Database
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongoose connected");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

//! Defining the user schema and model

const userSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("login.ejs");
});

//! Login page
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

//! Sign-up page
app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

//!Handle sign-up POST request

app.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hash the password
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    await newUser.save();
    req.session.user = newUser; // Store the user in the session
    res.render("home.ejs");
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Handle login POST request
app.post("/login", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found.");
    }

    if (user.password === password) {
      res.render("home.ejs", { naming: `${user.email}` });
    } else {
      res.status(401).send("Incorrect password.");
    }
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).send("Internal Server Error");
  }
});
//? Adding Questions

const questions = [
  {
    text: "What is the capital of France?",
    options: {
      A: "Berlin",
      B: "Madrid",
      C: "Paris",
      D: "Rome",
    },
    correctAnswer: "C",
  },
  // Add more questions here
];

// Render the EJS template with the questions
app.get("/quiz", (req, res) => {
  res.render("quiz.ejs", { questions });
});
//! hoem page
app.get("/home", (req, res) => {
  res.render("home.ejs");
});

//! about page
app.get("/about", (req, res) => {
  res.render("about.ejs");
});
app.get("/dashboad", (req, res) => {
  const user = req.session.user;
  // if (!user) {
  //   // Handle the case where the user is not authenticated
  //   return res.redirect("/login"); // Redirect to the login page or handle as needed
  // }

  res.render("dashboad.ejs", { user });
});

//! courses page
app.get("/courses", (req, res) => {
  res.render("courses.ejs");
});

//! quiz page
app.get("/quiz", (req, res) => {
  res.render("quiz.ejs");
});

//! logout page
app.get("/", (req, res) => {
  res.render("login.ejs");
});




let port = process.env.PORT;
if(port == null || port== ""){
  port= 3000 ;
}
app.listen(port)

app.listen(port, () => {
  console.log('Server is running successfully.');
});
