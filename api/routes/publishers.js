const express = require("express");
const app = express.Router();

const Joi = require("joi");
const bcrypt = require("bcryptjs");

const { Publisher } = require("../../db");
const { outError } = require("../../utility/errors");
const { authUser } = require("../../middleware/auth");

/**
 * @path /api/publishers
 */
app.get("/", async (req, res) => {
  const schema = Joi.object().keys({ 
    page: Joi.number().optional().default(1),
    limit: Joi.number().optional().default(10),
  })

  try {
    const data = await schema.validateAsync(req.query);

    const publishers = await Publisher.paginate({}, {
      page: data.page,
      limit: data.limit,
      select: "-password",
      lean: true
    });

    return res.status(200).json({
      ...publishers
    });
  } catch (error) {
    return outError(res, {error});
  }  
});

/**
 * @path /api/publishers/:publisher_id
 */
app.get("/:publisher_id", async (req, res) => {
  const publisher_id = req.params.publisher_id;
  
  try {
    const publisher = await Publisher.findOne({ _id: publisher_id }, "-password", { lean: true });

    return res.status(200).json(publisher);
  } catch (error) {
    return outError(res, { error })
  }  
});

/**
 * @path /api/publishers
 */
app.post("/", async (req, res) => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    business_info: Joi.object().keys({
        name: Joi.string().required(),
        city: Joi.string().required(),
        address: Joi.string().required(),
        cap: Joi.string().required(),
        p_iva: Joi.string().required(),
    }).required(),
    info: Joi.object().keys({
        description: Joi.string().optional(),
        cover: Joi.string().optional(),
        logo: Joi.string().optional(),
    }).optional(),
  });

  try {
    const data = await schema.validateAsync(req.body);

    data.password = bcrypt.hashSync(data.password);

    const publisher = await new Publisher(data).save();

    return res.status(201).json({
        ...publisher.toObject()
    });
  } catch (error) {
    return outError(res, { error });
  }
});

module.exports = app;