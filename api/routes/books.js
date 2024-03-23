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
 * @path /api/books/list?tag=<String>
 */
app.get("/list", authUser, async (req, res) => {
  const schema = Joi.object().keys({ 
    page: Joi.number().optional().default(1),
    limit: Joi.number().optional().default(10),
  })

  const querySchema = Joi.object().keys({
    tag: Joi.string().valid("ALL", "READ", "READING", "TO_READ", "FAVOURITES", "WHISHLIST").optional(),
  })

  try {
    const data = await schema.validateAsync(req.query);
    const filterObj = await querySchema.validateAsync(req.query);

    const books = await UserBook.paginate({...filterObj}, {
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
 * @path /api/books/list/:book_isbn
 */
app.delete("/list/:book_isbn", authUser, async (req, res) => {
  const user = req.user;
  const book = req.body.book;
  
  try {
    console.log(book);
    await UserBook.deleteOne({ user: user._id, book_isbn: book }, null, { lean: true });
    return res.status(200).json({ message: "book deleted" });
  } catch (error) {
    return outError(res, {error});
  }  
});

/**
 * @path /api/books/list/:book_id?action=[READING|READ]
 */
app.put("/list/:book_id", authUser, async (req, res) => {
  const user = req.user._id;
  const _id = req.params.book_id;
  const action = req.query.action || "READ";

  const schema = Joi.object().keys({
    start: Joi.date().optional().default(null),
    end: Joi.date().optional().default(null)
  });

  try {
    const data = await schema.validateAsync(req.body);

    const userBook = await UserBook.findOne({ user, _id }, null, { lean: true });

    if (userBook === null) {
      return res.status(404).json({ message: "book not found" });
    }

    let tags = [];

    if (action === "READ") {
      tags = ["READ", ...userBook.tags.filter(tag => tag !== "READING" && tag !== "TO_READ")];
    } else if (action === "READING") {
      tags = ["READING", ...userBook.tags.filter(tag => tag !== "READ" && tag !== "TO_READ")];
    } else if (action === "TO_READ") {
      tags = ["TO_READ", ...userBook.tags.filter(tag => tag !== "READING" && tag !== "READ")];
    }

    const updateObj = {
      read_date: {
        ...userBook.read_date
      },
      tags
    }
    if (data.start) updateObj.read_date.start = data.start;
    if (data.end) updateObj.read_date.end = data.end;
    
    await UserBook.updateOne({ user, _id }, updateObj);

    return res.status(200).json({ message: "userBook updated" });
  } catch (error) {
    return outError(res, { error });
  }
});

/**
 * @path /api/books/list/:book_id
 */
app.get("/list/:book_id", authUser, async (req, res) => {
  const book_id = req.params.book_id;
  
  try {
    const book = await Book.findOne({ _id: book_id }, null, { lean: true });

    return res.status(200).json(book);
  } catch (error) {
    return outError(res, { error })
  }
});

module.exports = app;