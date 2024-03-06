const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const {Schema, model } = mongoose;

const UserSchema = new Schema({
    first_name: { 
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,//non duplica i dati
    },
    password: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean,
        default: true
    },
    birth_date: {
        type: Date,
        default: null
    },
    gender: {
        type: String || null,
        enum: ["male", "female", "nd", null],
        default: null
    },
    region: {
        type: String,
        default: null
    },
    profile_img: {
        type: String || null,
        default: null
    },
    is_verified: {
        type: Boolean,
        default: false
    }
}, {
    strict: true, //non consentire il salvataggio di dati non espressi nello schema (se il parametro non è specificato nello schema)
    timestamps: true, //aggiunge due chiavi, aggiunge il valore della data in cui sono stati creati i dati e la data dell'ultima modifica dei dati
    versionKey: false //se true viene aggiunta una chiave che da la versione del documento.
});

UserSchema.plugin(mongoosePaginate);

const User = model("User", UserSchema);

module.exports = User;