const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const {Schema, model } = mongoose;

const UserAnaliticSchema = new Schema({
    event_type: { 
        type: String,
        enum: ["C", "R"], //c = created: inserito in lista, r = read
        required: true
    },
    book: { 
        type: Schema.Types.ObjectId,
        ref: "Book",
        required: true
    },
    author: { 
        type: Schema.Types.ObjectId,
        ref: "Author",
        required: true
    },
    publisher: { 
        type: Schema.Types.ObjectId,
        ref: "Publisher",
        required: true
    },
    category: { 
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    read_date: {
        type: Date || null,
        default: null
    }  
}, {
    strict: true, //non consentire il salvataggio di dati non espressi nello schema (se il parametro non è specificato nello schema)
    timestamps: true, //aggiunge due chiavi, aggiunge il valore della data in cui sono stati creati i dati e la data dell'ultima modifica dei dati
    versionKey: false //se true viene aggiunta una chiave che da la versione del documento.
});

UserAnaliticSchema.plugin(mongoosePaginate);

const UserAnalitic = model("UserAnalitic", UserAnaliticSchema);

module.exports = UserAnalitic;
