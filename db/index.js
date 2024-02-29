const mongoose = require("mongoose");

const connect = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("DB connected");
    } catch (error) {
        console.log(error);
    }
}

const disconnect = async () => {
    await mongoose.disconnect();
}

const models = {
    User: require("./models/User"),
    Publisher: require("./models/Publisher"),
    Category: require("./models/Category"),
    Author: require("./models/Author"),
    Book: require("./models/Book"),
    UserBook: require("./models/UserBook"),
    Rating: require("./models/Rating"),
    PublisherAnalitic: require("./models/PublisherAnalitic"),
    UserAnalitic: require("./models/UserAnalitic"),
}

module.exports = {
    connect,
    disconnect,
    ...models
}