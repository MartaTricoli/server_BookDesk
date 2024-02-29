const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.SERVER_PRIVATE_KEY);
}

const verifyToken = (token) => {
    return jwt.verify(token, process.env.SERVER_PRIVATE_KEY);
}

module.exports = { 
    generateToken,
    verifyToken
}