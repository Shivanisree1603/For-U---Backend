const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const {User} = require('./schema.js');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 8001;

// Start the server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

async function DBconnection() {
  try {
    await mongoose.connect("mongodb+srv://Shivani1603:Shivani1603@atlascluster.lm8gndu.mongodb.net/foru?retryWrites=true&w=majority&appName=AtlasCluster");
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

DBconnection();
app.get("/", function (req, res) {res.send("hiiiiiiiiiiiiiiiiiiiiiiii")})
app.post('/signup', async (req, res) => {
  try {
    const { username, emailid, password } = req.body;

    // Check if email is already in use
    const existingUser = await User.findOne({ emailid });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists. Please login.' });
    }

    // Check if username is already taken
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ error: 'Username is already taken. Please choose another one.' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailid)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    // Validate password strength (e.g., minimum length)
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Hash the password
    const encryptedUserPassword = await bcrypt.hash(password, 10);

    // Create the user
    await User.create({
      username,
      emailid,
      password: encryptedUserPassword,
    });

    res.status(201).json({ status: 'success', msg: 'User added successfully.' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ status: 'failure', msg: "Couldn't signup. Please try again later.", error: error.message });
  }
});
