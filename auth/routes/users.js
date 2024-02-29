const express = require("express");
const app = express.Router();

const Joi = require("joi");
const bcrypt = require("bcryptjs");
const { outError } = require("../../utility/errors");
const { User } = require("../../db");
const { generateToken } = require("../../utility/auth");

/**
 * @path /auth/users/token
 */
app.post("/token", async (req, res) => {
    const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    try {
        const data = await schema.validateAsync(req.body);

        const user = await User.findOne({ email: data.email, is_active: true }, null, { lean: true });

        if (user === null) {
            return res.status(404).json({ message: "user not found" });
        }

        const is_valid_password = bcrypt.compareSync(data.password, user.password);

        if (!is_valid_password) {
            return res.status(404).json({ message: "user not found" });
        }

        const token = generateToken({ _id: user._id, email: user.email, identity: "user" });

        return res.status(201).json({ token });
    } catch (error) {
        return outError(res, { error });
    }
});

module.exports = app;