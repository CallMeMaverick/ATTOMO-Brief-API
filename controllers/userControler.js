const User = require("../models/User");
const Accommodation = require("../models/Accommodation")
const jwt = require("jsonwebtoken");
const dismissBookings = require("../utils/dismissBookings");

const { validateEmail, validatePassword } = require("../utils/authValidators")
const {dismissBooking} = require("../utils/dismissBookings");
require("dotenv").config({ path: "../.env" });

exports.signup = async (req, res) => {
    const { name, surname, email, password } = req.body;
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

        return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ message: "Failed to create user", error: error.toString() });
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

        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }  // Adjust according to your needs
        );

        res.status(201).json({
            message: "Admin created successfully",
            user: newUser,
            token: token
        });
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

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send a single response back to the client
        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,  // For security, avoid sending sensitive information
                name: user.name,
                email: user.email
            },
            token: token
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Error during login", error: error.toString() });
    }
};

exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await User.findOne({ email, role: "admin" });
        if (!admin) {
            return res.status(401).json({ message: "User not found" });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expires in one hour
        );

        res.status(200).json({
            message: "Login successful",
            token: token, // Send the token to the client
            adminId: admin._id // Optionally include the admin ID
        });
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
    const userId = req.params.userId;

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
    const userId = req.params.userId;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "Could not find the user",
            });
        }

        // Dismiss all bookings
        for (const bookingId of user.bookings) {
            const result = await dismissBookings(bookingId);
            if (!result.success) {
                return res.status(500).json({
                    message: `Error dismissing booking with id ${bookingId}: ${result.message}`
                });
            }
        }

        // Delete the user
        await User.findByIdAndDelete(userId);

        res.status(200).json({
            message: "User successfully deleted"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting user",
            error: error.toString()
        });
    }
};

exports.book = async (req, res) => {
    const { userId, accommodationId } = req.params;

    try {
        const accommodation = await Accommodation.findById(accommodationId);
        if (!accommodation) {
            return res.status(404).json({
                message: "Could not find the accommodation"
            })
        }

        if (accommodation.bookedBy.length > 0) {
            return res.status(400).json({
                message: "Accommodation is already booked"
            })
        }

        accommodation.bookedBy.push(userId);
        await accommodation.save();

        const user = await User.findById(userId);
        console.log(user);
        if (user) {
            user.bookings.push(accommodationId);
            await user.save();
        }
        console.log("Bookings after update:", user.bookings);

        res.json({
            message: "Booking successful",
            accommodation: {
                id: accommodation._id,
                name: accommodation.name,
                location: accommodation.location
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to book accommodation",
            error: error.toString()
        });
    }
}

exports.getBooker = async (req, res) => {
    const { bookerId } = req.params;

    try {
        const booker = await User.findById(bookerId);
        res.json(booker);
    } catch (error) {
        res.status(500).json({
            message: "Could not fetch the booker",
            error: error.toString()
        })
    }
}

exports.getUserBookings = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        res.json(user.bookings);
    } catch (error) {
        res.status(500).json({
            message: "Could not fetch a user",
            error: error.toString()
        })
    }
}

exports.getAdmin = async (req, res) => {
    const adminId = req.params.adminId;

    try {
        const admin = await User.findById(adminId);
        res.json(admin);
    } catch (error) {
        res.status(500).json({
            message: "Could not fetch the admin",
            error: error.toString()
        })
    }
}

exports.updateAdmin = async (req, res) => {
    const adminId = req.params.adminId;
    const updatedData = req.body;

    try {
        const admin = await User.findByIdAndUpdate(adminId, updatedData, { new: true });
        if (!admin) {
            return res.status(404).json({
                message: "Admin not found"
            });
        }

        res.status(200).json({
            message: "Admin successfully updated",
            admin
        })
    } catch (error) {
        res.status(500).json({
            message: "Error updating the admin",
            error: error.toString()
        })
    }
}

exports.updateUser = async (req, res) => {
    const userId = req.params.userId;
    const updatedData = req.body;

    try {
        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User successfully updated",
            user
        })
    } catch (error) {
        res.status(500).json({
            message: "Error updating the admin",
            error: error.toString()
        })
    }
}