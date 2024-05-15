const Accommodation = require("../models/Accommodation")
const User = require("../models/User");


async function dismissBooking(accommodationId) {
    try {
        const accommodation = await Accommodation.findById(accommodationId);
        if (!accommodation) {
            throw new Error(`Accommodation with id ${accommodationId} not found`);
        }

        const bookerId = accommodation.bookedBy[0].toString();
        const booker = await User.findById(bookerId);
        if (!booker) {
            throw new Error(`User with id ${bookerId} not found`);
        }

        booker.bookings = booker.bookings.filter(id => id.toString() !== accommodationId);
        accommodation.bookedBy = accommodation.bookedBy.filter(id => id.toString() !== bookerId);

        await booker.save();
        await accommodation.save();

        return { success: true, message: "Booking dismissed" };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

module.exports = dismissBooking;