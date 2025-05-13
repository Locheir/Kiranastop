const jwt = require('jsonwebtoken');

const generateToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET_KEY);
}

module.exports = generateToken;