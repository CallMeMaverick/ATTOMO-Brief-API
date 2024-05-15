const mongoose = require('mongoose');
const Accommodation = require('./models/Accommodation');

mongoose.connect('mongodb+srv://admin:admin@cluster0.wa1qfm6.mongodb.net/ATTOMO_DB?retryWrites=true&w=majority&appName=Cluster0');

const accommodations = [
    {
        name: "Sea Breeze Hotel",
        type: "Hotel",
        location: "San Diego",
        pricePerNight: 150,
        images: "../assets/sea_breeze.jpeg",
        bookedBy: []
    },
    {
        name: "Mountain Lodge",
        type: "Cabin",
        location: "Rocky Mountains",
        pricePerNight: 180,
        images: "../assets/mountain_lodge.jpeg",
        bookedBy: []
    },
    {
        name: "Urban Modern Flat",
        type: "Apartment",
        location: "New York",
        pricePerNight: 200,
        images: "../assets/urban_modern.jpeg",
        bookedBy: []
    },
    {
        name: "Countryside B&B",
        type: "B&B",
        location: "Countryside",
        pricePerNight: 120,
        images: "../assets/countryside_bb.jpeg",
        bookedBy: []
    },
    {
        name: "Lakefront Cottage",
        type: "Cottage",
        location: "Lake Tahoe",
        pricePerNight: 220,
        images: "../assets/lakefront_cottage.jpeg",
        bookedBy: []
    }
];

Accommodation.insertMany(accommodations)
    .then(() => {
        console.log('Accommodations added successfully!');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Failed to add accommodations:', err);
        mongoose.connection.close();
    });
