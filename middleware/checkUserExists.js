const checkUserExists = async (req, res, next) => {
    const userId = req.session.userId; // Assuming userId is stored in session
    if (userId) {
        const user = await User.findById(userId);
        if (!user) {
            req.session.destroy();
            return res.redirect('/login');
        }
    }
    next();
};

module.exports = checkUserExists;