const { User } = require("../db");
const { verifyToken } = require("../utility/auth");
const { outError } = require("../utility/errors");

const authUser = async (req, res, next) => {
    const token = req.headers?.authorization?.replace("Bearer ", "") || null;

    if (!token) {
        return res.status(403).json({ message: "not authorized" });
    }

    try {
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(403).json({ message: "not authorized" });
        }
   
        const user = await User.findOne({ _id: decoded._id, is_active: true }, "-password", { lean: true });

        if (!user) {
            return res.status(403).json({ message: "not authorized" });
        }

        req.user = user;

        return next();
    } catch (error) {
        return outError(res, { error, code: 403, message: "not authorized" });
    }
}

module.exports = { 
    authUser
}