const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({  
    name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    answer: {type: String, required: true},
    password:{type: String, required: true},
    address: {type: String, required: true},
    role: {type: Number, required: true , default: 0},
    createdProducts: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], sparse: true, default: [] },
})

module.exports = mongoose.model('Users', userSchema);