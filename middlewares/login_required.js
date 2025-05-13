module.exports = function loginRequired(req, res, next) {
    if (req.session && req.session.user) {
        return next(); // User is logged in, continue to the route
    }

    // If it's an AJAX request (e.g., from fetch)
    if (req.headers['content-type'] === 'application/json') {
        return res.status(401).json({
            success: false,
            loginRequired: true,
            message: 'You need to login first'
        });
    }

    // For normal browser requests
    return res.redirect('/login');
};