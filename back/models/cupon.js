'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CuponSchema = Schema({
    createdAt: {type:Date, default: Date.now, required: true},
    codigo:{type: String, required:true},
    valor:{type: Number, required:true},
    limite:{type: Number, required:true},
    tipo:{type: String, required:true}, //Porcentaje o Precio fijo
});

module.exports= mongoose.model('cupon', CuponSchema);