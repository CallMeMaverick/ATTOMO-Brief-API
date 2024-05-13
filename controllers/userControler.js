const User = require("../models/User");

const { validateEmail, validatePassword } = require("../utils/authValidators")
require("dotenv").config({ path: "../.env" });

exports.signup = async (req, res) => {
    const { name, surname, email, password } = req.body;

    // Validate email and password
    if (!validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email format." });
    }
    if (!validatePassword(password)) {
        return res.status(400).json({ message: "Password must be at least 8 characters long and contain a mix of letters and numbers." });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        const newUser = new User({
            name,
            surname,
            email,
            password
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Failed to create user", error: error.toString() });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Error during login", error: error.toString() });
    }
};