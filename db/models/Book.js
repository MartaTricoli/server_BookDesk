const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const {Schema, model } = mongoose;

const BookSchema = new Schema({
    // publisher: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Publisher",
    //     required: true
    // },
    publisher: {
        type: String,
        default: null
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: false
    },
    // author: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Author",
    //     required: true
    // },
    author: {
        type: String,
        default: null
    },
    name: { 
        type: String,
        required: true
    },
    isbn: {
        type: [String],
        required: true
    },
    cover: {
        type: String,
        default: null
    },
    info: {
        type: {
            languages: {
                type: [String],
            },
            pages: {
                type: Number
            },
            fpy: { //first publication year
                type: Number
            },
        }
    },
    rating_average: {
        type: Number,
        default: 0
    },
    rating_count: {
        type: Number,
        default: 0
    },
}, {
    strict: true, //non consentire il salvataggio di dati non espressi nello schema (se il parametro non è specificato nello schema)
    timestamps: true, //aggiunge due chiavi, aggiunge il valore della data in cui sono stati creati i dati e la data dell'ultima modifica dei dati
    versionKey: false //se true viene aggiunta una chiave che da la versione del documento.
});

BookSchema.plugin(mongoosePaginate);

const Book = model("Book", BookSchema);

module.exports = Book;