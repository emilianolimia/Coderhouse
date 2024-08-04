const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: [String],
        default: []
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
})

// Agrega el plugin mongoose-paginate-v2 al esquema
productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model("products", productSchema);

module.exports = productModel;