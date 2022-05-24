'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CuponSchema = Schema({
    createdAt: {type:Date, default: Date.now, required: true},
    codigo:{type: String, required:true},
    valor:{type: Number, required:true},
    limite:{type: Number, required:true},
    vencimiento:{type: Date, required:false},
    tipo:{type: Boolean, required:true}, //Porcentaje = true o Precio fijo = false
});

module.exports= mongoose.model('cupon', CuponSchema);