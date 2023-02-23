'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CarritoSchema = Schema({
    producto: {type: Schema.ObjectId, ref: 'producto', required: true},
    cliente: {type: Schema.ObjectId, ref: 'cliente', required: true},
    cantidad: {type: Number, required: true},
    variedad: {type: String, required: false},
    createdAt: {type:Date, default: Date.now, required: true},
});

module.exports= mongoose.model('carrito', CarritoSchema);