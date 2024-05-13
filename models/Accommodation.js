const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accommodationSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    location: String,
    pricePerNight: { type: Number, required: true },
    images: String,
    bookedBy: { type: [Schema.Types.ObjectId], ref: "users" }
}, { timestamps: true });

module.exports = mongoose.model('accommodations', accommodationSchema);
