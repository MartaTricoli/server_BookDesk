const express = require("express");
const { authUser } = require("../../../middleware/auth");
const Joi = require("joi");
const { outError } = require("../../../utility/errors");
const { getDateFromString } = require("../../../utility/dates");
const { UserAnalitic } = require("../../../db");
const app = express.Router();

/**
 * @path /api/analitics/users
 */
app.post("/", authUser, async (req, res) => {
    const user = req.user._id;

    const schema = Joi.object().keys({
        event_type: Joi.string().valid("C", "R").required(),
        book: Joi.string().required(),
        author: Joi.string().required(),
        publisher: Joi.string().required(),
        category: Joi.string().required(),
        read_date: Joi.string().optional()
    })

    try {
        const data = await schema.validateAsync(req.body);

        data.user = user;

        if (data.read_date) {
            data.read_date = getDateFromString(data.read_date);
        }

        const event = await new UserAnalitic(data).save();

        return res.status(201).json({ event: event.toObject() });
    } catch (error) {
        return outError(res, { error });
    }
})


module.exports = app;