const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const {Schema, model } = mongoose;

const PublisherSchema = new Schema({
    name: { 
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
    business_info: {
        type: {
            name: {
                type: String
            },
            city: {
                type: String
            },
            address: {
                type: String
            },
            cap: {
                type: String
            },
            p_iva: {
                type: String
            }
        },
        required: true
    },
    info: {
        type: {
            description: {
                type: String
            },
            cover: {
                type: String
            },
            logo: {
                type: String
            }
        }
    }    
}, {
    strict: true, //non consentire il salvataggio di dati non espressi nello schema (se il parametro non è specificato nello schema)
    timestamps: true, //aggiunge due chiavi, aggiunge il valore della data in cui sono stati creati i dati e la data dell'ultima modifica dei dati
    versionKey: false //se true viene aggiunta una chiave che da la versione del documento.
});

PublisherSchema.plugin(mongoosePaginate);

const Publisher = model("Publisher", PublisherSchema);

module.exports = Publisher;