require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(helmet());
app.use(cors());

app.use(express.urlencoded({ extended:true }));
app.use(express.json({ extended:true }));

app.use("/api", require("./api"));
app.use("/auth", require("./auth"));

db.connect();

app.listen(process.env.SERVER_PORT, () => {
    console.log(`server up and running on port ${process.env.SERVER_PORT}`);
});