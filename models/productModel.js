const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        
    },
    slug:{
        type: String,
        lowercase: true,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    updatedAt: Date,
    photo:{
        data:Buffer,
        contentType: String
    },
    quantity:{
        type: Number,
        required: true,
    },
    shipping:{
        type:Boolean,
    },                  
}, {timestamps: true})        

module.exports = mongoose.model('Product', productSchema);