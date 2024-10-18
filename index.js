const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 8481;

// Connect with database
const username = process.env.MONGODB_USERNAME;
const passcode = process.env.MONGODB_PASSWORD;

mongoose
  .connect(`mongodb+srv://${username}:${passcode}@cluster0.hzgu3.mongodb.net/RegistrationDataDB`)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Mongoose Schema with validation
const RegistrationSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  dob: { type: Date, required: true },
  mobile: { type: Number, required: true },
  email: { type: String, required: true },
  gender: { type: String, required: true },
  education: { type: String, required: true },
  password: { type: String, required: true }
});

const Registration = mongoose.model("Registration", RegistrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routing Process --> Requests

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/pages/homepage.html"); // Index.html <Opening Page>
});

app.get("/homepage.html", (req, res) => {
  res.sendFile(__dirname + "/pages/homepage.html"); // Index.html <Back To Home>
});

//CSS & JS part connection
app.get("/style.css", (req, res) => {
  res.sendFile(__dirname + "/pages/style.css");
});


app.get("/script.js", (req, res) => {
  res.sendFile(__dirname + "/pages/script.js");
});

//Registration & Login Part
app.get("/auth/registration.html", (req, res) => {
  res.sendFile(__dirname + "/pages/auth/registration.html"); // Registration.html
});

app.get("/auth/login.html", (req, res) => {
  res.sendFile(__dirname + "/pages/auth/login.html"); // Login.html
});

//Status pages part
app.get("/status/success.html", (req, res) => {
  res.sendFile(__dirname + "/pages/status/success.html");
});

app.get("/status/error.html", (req, res) => {
  res.sendFile(__dirname + "/pages/status/error.html");
});

//BlogPage RedirectionPath
// app.get("/blogpage.html", (req, res) => {
//   res.sendFile(__dirname + "/pages/blogpage.html");
// });

// Routing Process --> Responses for action 'register'
app.post("/register", async (req, res) => {
  try {
    const {fullname, dob, mobile, email, gender, education, password } = req.body;

    const existingUser = await Registration.findOne({email: email});
    if(!existingUser == true){
      const registrationData = new Registration({
        fullname,
        dob,
        mobile,
        email,
        gender,
        education,
        password
      });
      await registrationData.save();
      res.redirect("/status/success.html");
    }
    else{
      res.redirect("/status/error.html");
    }
  } 
  catch (error) {
    res.redirect("/status/error.html");
  }
});


let isLoggedIn = false;
app.post("/logcheck", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await Registration.findOne({ email: email });
    
    if (existingUser && existingUser.password === password) {
      isLoggedIn = true; 
      res.redirect("/blogpage.html");
    } 
    else {
      res.redirect("/status/error.html");
    }
  } 
  catch (error) {
    res.redirect("/status/error.html");
  }
});


const checkLogin = (req, res, next) => {
  if (isLoggedIn) {
    next(); 
  } 
  else {
    res.redirect("/auth/login.html");
  }
};


app.get("/blogpage.html", checkLogin, (req, res) => {
  res.sendFile(__dirname + "/pages/blogpage.html");
});


app.listen(port, () => {
  console.log(`Server Is Running On Port:${port}`);
});
