const express = require("express");
const app = express.Router();

const Joi = require("joi");


const { Book, UserBook } = require("../../db");
const { outError } = require("../../utility/errors");
const { authUser } = require("../../middleware/auth");
const { retriveBook } = require("../../middleware/books");

/**
 * @path /api/books/list
 */
app.post("/list", authUser, retriveBook, async (req, res) => {
  const book = req.book;
  const user = req.user;
  const tag = req.body.tag;

  try {
    let _book = await Book.findOne({ isbn: book.isbn }, null, { lean: true });

    if (_book === null) {
      _book = (await new Book(book).save()).toObject();
    }

    let _userBook = await UserBook.findOne({ user: user._id, book: _book._id }, null, { lean: true });
    
    if (_userBook === null) {
      _userBook = (await new UserBook({ 
        user,
        book: _book._id,
        tags: tag === "ALL" ? [tag] : ["ALL", tag] 
      }).save()).toObject();
    } else {
      console.log(_userBook);
      const tags = new Set([tag, ...Array.from(_userBook.tags)]);
      await UserBook.updateOne({ user: user._id, book: _book._id }, { tags });
      _userBook.tags = tags;
    }
    
    return res.status(200).json({ userBook: _userBook });
  } catch (error) {
    return outError(res, { error });
  }
})

/**
 * @path /api/books
 */
app.get("/", async (req, res) => {
  const schema = Joi.object().keys({ 
    page: Joi.number().optional().default(1),
    limit: Joi.number().optional().default(10),
  })

  try {
    const data = await schema.validateAsync(req.query);

    const books = await Book.paginate({}, {
      page: data.page,
      limit: data.limit,
      lean: true
    });

    return res.status(200).json({
      ...books
    });
  } catch (error) {
    return outError(res, {error});
  }  
});

/**
 * @path /api/books/search?q=:book_title
 */
app.get("/search?q=:book_title", async (req, res) => {
  const book_title = req.params.book_title;
  
  try {
    const book = await User.findOne({ title: book_title }, null, { lean: true });

    return res.status(200).json(book);
  } catch (error) {
    return outError(res, { error })
  }  
});

module.exports = app;