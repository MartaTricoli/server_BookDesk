const express = require("express");
const { authUser, authPublisher } = require("../../middleware/auth");
const app = express.Router();

/**
 * @path /api/me/users
 */
app.get("/users", authUser, (req, res) => {
    return res.status(200).json(req.user);
});

/**
 * @path /api/me/publishers
 */
app.get("/publishers", authPublisher, (req, res) => {
    return res.status(200).json(req.publisher);
});

module.exports = app;