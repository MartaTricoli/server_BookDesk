const express = require("express");
const { authUser } = require("../../../middleware/auth");
const { getAgeRangeFromDate } = require("../../../utility/dates");
const Joi = require("joi");
const app = express.Router();

/**
 * @path /api/analitics/publishers
 */
app.post("/", authUser, async (req, res) => {
    const user = req.user._id;

    const schema = Joi.object().keys({
        event_type: Joi.string().valid("C", "R").required(),
        book: Joi.string().required(),
        author: Joi.string().required(),
        publisher: Joi.string().required(),
        user_gender: Joi.string().default(user.gender).optional(),
        user_region: Joi.string().default(user.region).optional(),
        category: Joi.string().required(),
        read_date: Joi.string().optional()
    })

    try {
        const data = await schema.validateAsync(req.body);

        if (data.read_date) {
            data.read_date = getDateFromString(data.read_date);
        }

        data.user_bd_range = getAgeRangeFromDate(user.birth_date);

        const event = await new UserAnalitic(data).save();

        return res.status(201).json({ event: event.toObject() });
    } catch (error) {
        return outError(res, { error });
    }
})

module.exports = app;