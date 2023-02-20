'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductoSchema = Schema({
    titulo: { type: String, required: true },
    codigo: { type: String, required: true },
    slug: { type: String, required: true },
    galeria: [{ type: Object, required: false }],
    portada: { type: String, required: true },
    precio: { type: Number, required: true },
    descripcion: { type: String, required: true },
    contenido: { type: String, required: true },
    npuntos: { type: Number, required: true, default: 0 },
    nventas: { type: Number, required: true, default: 0 },
    categoria: { type: String, required: true },
    estado: { type: String, required: true, default: 'Edicion' },
    createdAt: { type: Date, default: Date.now, require: true },
    dadoBaja: { type: String, required: false, default: false },
    variedades: [{ type: Object, required: false }],
    titulo_variedad: { type: String, required: false },
    //Datos exclusivos de productos
    alerta_stock: { type: Number, required: true }, //Agregar requerimiento de dato
    stock: { type: Number, required: true }, //Agregar requerimiento de dato
});

module.exports = mongoose.model('producto', ProductoSchema);