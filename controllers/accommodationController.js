const Accommodation = require("../models/Accommodation");

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

        await Accommodation.save();

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
    const { accommodationId } = req.params.accommodationId;

    try {
        const result = await Accommodation.findByIdAndDelete(accommodationId);

        if (result) {
            return res.status(404).json({
                message: "Accommodation not found"
            })
        }

        res.status(200).json({
            message: "Accommodation successfully deleted"
        })
    } catch (error) {
        res.status(500).json({
            message: "Error deleting accommodation",
            error: error.toString()
        })
    }
}