const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const {Schema, model } = mongoose;

const UserBookSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    book: {
        type: Schema.Types.ObjectId,
        ref: "Book",
        required: true
    },
    read_date: {
        type: {
            start: {
                type: Date,
                default: null
            },
            end: {
                type: Date,
                default: null
            }
        },
        default: {
            start: null,
            end: null
        }
    }  
}, {
    strict: true, //non consentire il salvataggio di dati non espressi nello schema (se il parametro non è specificato nello schema)
    timestamps: true, //aggiunge due chiavi, aggiunge il valore della data in cui sono stati creati i dati e la data dell'ultima modifica dei dati
    versionKey: false //se true viene aggiunta una chiave che da la versione del documento.
});

UserBookSchema.plugin(mongoosePaginate);

const UserBook = model("UserBook", UserBookSchema);

module.exports = UserBook;