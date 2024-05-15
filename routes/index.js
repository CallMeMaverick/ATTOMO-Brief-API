const router = require("express").Router();
const User = require("../models/User");
const userController = require("../controllers/userControler")
const Accommodation = require("../models/Accommodation");
const accommodationController = require("../controllers/accommodationController");
const { authenticate, authenticateAndAuthorizeAdmin } = require("../middleware/authenticate")

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
router.get("/user/:userId", authenticate, userController.getUser)
// Getting user bookings
router.get('/user/:userId/bookings', authenticate,  userController.getUserBookings)
// Deleting user (admin role)
router.delete("/user/:userId", authenticateAndAuthorizeAdmin, userController.deleteUser)
// Getting booker
router.get("/booker/:bookerId", userController.getBooker)
// Getting the admin (admin role)
router.get('/user/admin/:adminId', authenticateAndAuthorizeAdmin, userController.getAdmin)
// Updating the admin (admin role)
router.put("/user/admin/update/:adminId", authenticateAndAuthorizeAdmin, userController.updateAdmin);
// Updating the user
router.put("/user/update/:userId", authenticate, userController.updateUser);
// Booking accommodation
router.post('/accommodation/:userId/:accommodationId/book', authenticate, userController.book)


// Getting all accommodations
router.get('/accommodations', accommodationController.getAccommodations);
// Getting accommodation for the user
router.get('/accommodation/:accommodationId', accommodationController.getAccommodationUser)
// Getting specific accommodation by id (admin role)
router.get('/accommodation/:accommodationId', authenticateAndAuthorizeAdmin, accommodationController.getAccommodation)
// Adding accommodation (admin status)
router.post('/accommodations', authenticateAndAuthorizeAdmin, accommodationController.addAccommodation);
// Deleting accommodation (admin status)
router.delete("/accommodation/:accommodationId", authenticateAndAuthorizeAdmin, accommodationController.deleteAccommodation);
// Dismissing the booking
router.post('/accommodation/:accommodationId/dismissBooking', authenticateAndAuthorizeAdmin, accommodationController.dismissBooking);
// Updating the accommodation (admin role)
router.put('/accommodations/update/:accommodationId', authenticateAndAuthorizeAdmin, accommodationController.updateAccommodation);

module.exports = router;