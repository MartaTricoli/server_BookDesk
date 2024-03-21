const Joi = require("joi");
const { formatLink } = require("../utility/links");
const { outError } = require("../utility/errors");

const retriveBook = async (req, res, next) => {
    const schema = Joi.object().keys({
        book: Joi.object().required(),
        tag: Joi.string().optional().default("ALL")
    });

    try {
        const {book: book_info, tag} = await schema.validateAsync(req.body);

        const book = {
            name: book_info.title,
            publisher: Array.isArray(book_info.publisher) ? book_info.publisher[0] : book_info.publisher,
            author: Array.isArray(book_info.author_name) ? book_info.author_name[0] : book_info.author_name,
            isbn: Array.isArray(book_info.isbn) ? book_info.isbn[0] : book_info.isbn,
            cover: formatLink(process.env.BOOK_COVER, "%_COVER_ID_%", book_info.cover_i),
            info: {
                languages: Array.isArray(book_info.language) ? book_info.language[0] : book_info.language,
                pages: book_info.number_of_pages_median,
                fpy: Array.isArray(book_info.publish_year) ? book_info.publish_year[0] : book_info.publish_year,
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