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