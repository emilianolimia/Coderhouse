const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    products: [ 
        {
            id_prod: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'products'
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
})

const cartModel = mongoose.model("carts", cartSchema);

export default cartModel;