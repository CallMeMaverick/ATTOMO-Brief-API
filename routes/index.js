const router = require("express").Router();
const User = require("../models/User");
const userController = require("../controllers/userControler")
const Accommodation = require("../models/Accommodation");
const accommodationController = require("../controllers/accommodationController");
const { authenticateAndAuthorizeAdmin } = require("../middleware/authenticate")

// User sing up
router.post('/signup', userController.signup);
// Admin sign up
router.post("/signup/admin", userController.signupAdmin);
// User log in
router.post('/login', userController.login);
// Admin log in
router.post('/login/admin', userController.loginAdmin);
// Getting all users (admin role)
router.get('/users', authenticateAndAuthorizeAdmin, userController.getUsers)
// Getting a user by id (admin role)
router.get("/user/:userId", authenticateAndAuthorizeAdmin, userController.getUser)
// Deleting user (admin role)
router.delete("/user/:userId", authenticateAndAuthorizeAdmin, userController.deleteUser)
// Booking accommodation
router.post('/accommodation/:accommodationId/book', userController.book)


// Getting all accommodations
router.get('/accommodations', accommodationController.getAccommodations);
// Getting specific accommodation by id (admin role)
router.get('/accommodation/:accommodationId', authenticateAndAuthorizeAdmin, accommodationController.getAccommodation)
// Adding accommodation (admin status)
router.post('/accommodations', authenticateAndAuthorizeAdmin, accommodationController.addAccommodation);
// Deleting accommodation (admin status)
router.delete("/accommodation/:accommodationId", authenticateAndAuthorizeAdmin, accommodationController.deleteAccommodation);
// Dismissing the booking
router.post('/accommodation/:accommodationId/dismissBooking', authenticateAndAuthorizeAdmin, accommodationController.dismissBooking);


module.exports = router;