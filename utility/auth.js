const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.SERVER_PRIVATE_KEY);
}

const verifyToken = (token) => {
    return jwt.verify(token, process.env.SERVER_PRIVATE_KEY);
}

const generateEmailVerifyToken = (entity, payload) => {
    return jwt.sign({ entity, ...payload }, process.env.SERVER_PRIVATE_KEY);
}

const validateEmailVerifyToken = (entity, token) => {
    const decoded = jwt.verify(token, process.env.SERVER_PRIVATE_KEY);

    if (decoded.entity !== entity) {
        throw new Error("invalid token");
    }

    return decoded;
}

module.exports = { 
    generateToken,
    verifyToken,
    generateEmailVerifyToken,
    validateEmailVerifyToken
}