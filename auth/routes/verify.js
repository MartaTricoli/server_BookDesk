const express = require("express");
const { validateEmailVerifyToken } = require("../../utility/auth");
const { outError } = require("../../utility/errors");
const { User, Publisher } = require("../../db");
const app = express.Router();

/**
 * @path /auth/verify
 */
app.get("/", async (req, res) => {
    const { token, entity } = req.query;

    try {
        const is_valid = validateEmailVerifyToken(entity, token);

        const Entity = is_valid.entity === "user" ? User : Publisher;
        
        await Entity.updateOne({ _id: is_valid._id }, { is_verified: true });

        return res.status(200).json({ message: "email verified" });
    } catch (error) {
        return outError(res, { error });
    }
})

module.exports = app;