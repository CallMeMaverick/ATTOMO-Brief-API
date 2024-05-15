const Accommodation = require("../models/Accommodation");
const User = require("../models/User")
const dismissBookings = require("../utils/dismissBookings")


exports.getAccommodations = async (req, res) => {
    const { type, location, priceLt, sort } = req.query;
    let query = {}

    // If values has been specified, assign them to query
    if (type) query.type = type;
    if (location) query.location = location;
    if (priceLt) query.pricePerNight = { $lt: +priceLt };

    try {
        const accommodations = await Accommodation.find(query).sort(sort || "name");
        res.json(accommodations);
    } catch (error) {
        res.status(500).json({
            message: "Could not retrieve the collection",
            error: error.toString()
        })
    }
}

exports.addAccommodation = async (req, res) => {
    const { name, type, location, pricePerNight, images } = req.body;

    try {
        const newAccommodation = new Accommodation({
            name,
            type,
            location,
            pricePerNight,
            images
        })

        await newAccommodation.save();

        res.status(201).json({
            message: "Accommodation added successfully",
            accommodation: newAccommodation
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to add an accommodation",
            error: error.toString()
        })

    }
}

exports.deleteAccommodation = async (req, res) => {
    const {accommodationId} = req.params;

    try {
        const accommodation = await Accommodation.findById(accommodationId);
        console.log("FIND");
        if (!accommodation) {
            return res.status(404).json({
                message: "Accommodation not found"
            });
        }

        console.log("found accommodation");
        if (accommodation.bookedBy.length !== 0) {
            const result = await dismissBookings(accommodationId);
            if (!result.success) {
                return res.status(500).json({
                    message: `Error dismissing booking: ${result.message}`
                });
            }
        }

        console.log("deleting accommodation");
        await Accommodation.findByIdAndDelete(accommodationId);

        res.status(200).json({
            message: "Accommodation successfully deleted"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting accommodation",
            error: error.toString()
        });
    }
};

exports.getAccommodation = async (req, res) => {
    const { accommodationId } = req.params;

    try {
        const accommodation = await Accommodation.findById(accommodationId);
        res.json(accommodation)
    } catch (error) {
        res.status(500).json({
            message: "Could not fetch the accommodation",
            error: error.toString()
        })
    }
}

exports.dismissBooking = async(req, res) => {
    const accommodationId = req.params.accommodationId;

    try {
        const accommodation = await Accommodation.findById(accommodationId);

        if (!accommodation) {
            return res.status(404).json({
                message: "Could not found the accommodation"
            })
        }

        const bookerId = accommodation.bookedBy[0].toString();
        console.log(bookerId);
        const booker = await User.findById(bookerId);

        if (!booker) {
            return res.status(404).json({
                message: "Could not found the user"
            })
        }

        booker.bookings = booker.bookings.filter(id => id.toString() !== accommodationId);
        accommodation.bookedBy = accommodation.bookedBy.filter(id => id.toString() !== bookerId);

        await booker.save();
        await accommodation.save();

        res.status(200).json({
            message: "Booking dismissed"
        })
    } catch (error) {
        res.status(500).json({
            error: "Could not dismiss the booking"
        })
    }
}

exports.getAccommodationUser = async (req, res) => {
    const { accommodationId } = req.params;

    try {
        const accommodation = await Accommodation.findById(accommodationId);
        res.json(accommodation);
    } catch (error) {
        res.status(500).json({
            message: "Could not fetch the accommodation",
            error: error.toString()
        })
    }
}

exports.updateAccommodation = async (req, res) => {
    const { accommodationId } = req.params;
    const updatedData = req.body;

    try {
        const accommodation = await Accommodation.findByIdAndUpdate(accommodationId, updatedData, { new: true });

        if (!accommodation) {
            return res.status(404).json({
                message: "Accommodation not found"
            });
        }

        res.status(200).json({
            message: "Accommodation successfully updated",
            accommodation
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating accommodation",
            error: error.toString()
        });
    }
};


