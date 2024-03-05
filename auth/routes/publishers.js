const express = require("express");
const app = express.Router();

const Joi = require("joi");
const bcrypt = require("bcryptjs");
const { outError } = require("../../utility/errors");
const { Publisher } = require("../../db");
const { generateToken } = require("../../utility/auth");

/**
 * @path /auth/publishers/token
 */
app.post("/token", async (req, res) => {
    const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    try {
        const data = await schema.validateAsync(req.body);

        const publisher = await Publisher.findOne({ email: data.email, is_active: true }, null, { lean: true });

        if (publisher === null) {
            return res.status(404).json({ message: "publisher not found" });
        }

        const is_valid_password = bcrypt.compareSync(data.password, publisher.password);

        if (!is_valid_password) {
            return res.status(404).json({ message: "publisher not found" });
        }

        const token = generateToken({ _id: publisher._id, email: publisher.email, identity: "publisher" });

        delete publisher.password;

        return res.status(201).json({ token, publisher, identity: "publisher" });
    } catch (error) {
        return outError(res, { error });
    }
});

module.exports = app;