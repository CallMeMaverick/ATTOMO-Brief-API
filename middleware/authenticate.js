const jwt = require('jsonwebtoken');
require("dotenv").config({ path: "../.env" })

const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // Bearer <token>
        req.userData = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({ message: "Authentication failed" });
    }
};

module.exports = authenticate;
