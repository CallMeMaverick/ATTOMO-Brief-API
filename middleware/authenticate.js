const jwt = require('jsonwebtoken');
require("dotenv").config({ path: "../.env" })

const authenticate = (req, res, next) => {
    try {
        console.log(req.headers);
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        console.log("THIS, ", process.env.JWT_SECRET);
        req.userData = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        console.error("Authentication error:", error); // Debug log
        return res.status(401).json({ message: "Authentication failed" });
    }
};

const authenticateAndAuthorizeAdmin = (req, res, next) => {
    authenticate(req, res, () => { // Use authenticate middleware first
        if (req.userData && req.userData.role === "admin") {
            next(); // User is authenticated and is an admin, proceed to the next middleware
        } else {
            return res.status(403).json({ message: "Access denied: requires admin role" });
        }
    });
}

module.exports = {
    authenticate,
    authenticateAndAuthorizeAdmin
};
