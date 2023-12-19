const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    products: [{
        type: mongoose.ObjectId,
        ref: 'Product'  
    },
    ],
    payment: {},
    buyer: {
        type: mongoose.ObjectId,
        ref: 'Users'
    },
    status: {
        type: String,
        default: 'Not Processed',
        enum: ['Not Processed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
    },
},
{ timestamps: true }
)

module.exports = mongoose.model('Order', orderSchema);