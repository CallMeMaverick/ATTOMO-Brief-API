const router = require("express").Router();
const User = require("../models/User");
const userController = require("../controllers/userControler")

router.post('/signup', userController.signup);

router.post('/login', userController.login);

module.exports = router;