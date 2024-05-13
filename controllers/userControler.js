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
            password,
            bookings: []
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Failed to create user", error: error.toString() });
    }
};

exports.signupAdmin = async (req, res) => {
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
            password,
            role: "admin",
            bookings: []
        });

        await newUser.save();
        res.status(201).json({ message: "Admin created successfully", user: newUser });
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

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users)
    } catch (error) {
        res.json({
            message: "Could not fetch users",
            error: error.toString()
        })
    }
}

exports.getUser = async (req, res) => {
    const { userId } = req.params.userId;

    try {
        const user = await User.findById(userId);
        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: "Could not fetch the user",
            error: error.toString()
        })
    }
}

exports.deleteUser = async (req, res) => {
    const { userId } = req.params.userId;

    try {
        const result = await User.findByIdAndDelete(userId);

        if (!result) {
            return res.status(404).json({
                message: "Could not found the user",
            })
        }

        res.status(200).json({
            message: "User successfully deleted"
        })
    } catch (error) {
        res.status(500).json({
            message: "Error deleting user",
            error: error.toString()
        })
    }
}