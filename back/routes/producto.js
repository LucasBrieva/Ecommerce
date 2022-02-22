'use strict'

var express = require("express");
var productoController = require("../controllers/ProductoController");

var api = express.Router();
var auth = require("../middlewares/authenticate");
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir:'./uploads/productos'})

//Le paso el path porque le mando una imagen.
api.post('/registro_producto_admin', [auth.auth, path], productoController.registro_producto_admin);
api.post('/baja_producto_admin/:id', auth.auth, productoController.baja_producto_admin);

api.put('/actualizar_producto_admin/:id', [auth.auth, path], productoController.actualizar_producto_admin);

api.get('/listar_productos_filtro_admin/:tipo/:filtro?', auth.auth, productoController.listar_productos_filtro_admin);
api.get('/obtener_portada/:img', productoController.obtener_portada);
api.get('/obetener_producto_admin/:id', auth.auth, productoController.obetener_producto_admin);



module.exports = api;
