const Joi = require("joi");
const axios = require("axios");
const { formatLink } = require("../utility/links");
const { outError } = require("../utility/errors");

const retriveBook = async (req, res, next) => {
    const schema = Joi.object().keys({
        isbn: Joi.string().required(),
        tag: Joi.string().optional().default("ALL")
    });

    try {
        const data = await schema.validateAsync(req.body);

        const book_url = formatLink(process.env.BOOK_API, "%_ISBN_%", data.isbn);

        const response = await axios({
            url: book_url,
            method: "GET"
        });

        const book_info = response.data.docs[0];

        const book = {
            name: book_info.title,
            publisher: book_info.publisher[0],
            author: book_info.author_name[0],
            isbn: data.isbn,
            cover: formatLink(process.env.BOOK_COVER, "%_COVER_ID_%", book_info.cover_i),
            info: {
                languages: book_info.language[0],
                pages: book_info.number_of_pages_median,
                fpy: book_info.publish_year[0]
            }
        }

        req.book = book;

        return next();
    } catch (error) {
        return outError(res, { error });
    }
}

module.exports = {
    retriveBook
}