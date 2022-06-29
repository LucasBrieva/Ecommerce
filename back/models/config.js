'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConfigSchema = Schema({
    categorias: [{type: Object, required: true}],
    razonSocial:{type: String, required: true},
    logo: {type: String, required: true},
    nSerie: {type: String, required: true},
    correlativo: {type: String, required: true},
});

module.exports= mongoose.model('config', ConfigSchema);