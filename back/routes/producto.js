'use strict'

var express = require("express");
var productoController = require("../controllers/ProductoController");

var api = express.Router();
var auth = require("../middlewares/authenticate");
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir:'./uploads/productos'})

//Le paso el path porque le mando una imagen.
api.post('/registro_producto_admin', [auth.auth, path], productoController.registro_producto_admin);
api.post('/listar_productos_filtro_admin/', [auth.auth, path], productoController.listar_productos_filtro_admin);

api.put('/actualizar_producto_admin/:id', [auth.auth, path], productoController.actualizar_producto_admin);
api.put('/actualizar_producto_variedades_admin/:id', auth.auth, productoController.actualizar_producto_variedades_admin);
api.put('/agregar_imagen_galeria_admin/:id', [auth.auth, path], productoController.agregar_imagen_galeria_admin);
api.put('/eliminar_imagen_galeria_admin/:id', auth.auth, productoController.eliminar_imagen_galeria_admin);

api.get('/obtener_portada/:img', productoController.obtener_portada);
api.get('/obtener_producto_admin/:id', auth.auth, productoController.obtener_producto_admin);
api.put('/baja_producto_admin/:id', auth.auth, productoController.baja_producto_admin);

//INVENTARIO
api.get('/listar_inventario_producto_admin/:id', auth.auth, productoController.listar_inventario_producto_admin);
api.post('/registro_inventario_producto_admin', auth.auth, productoController.registro_inventario_producto_admin);

//PÚBLICOS

api.get('/listar_productos_filtro_publico/:filtro?', productoController.listar_productos_filtro_publico);


module.exports = api;
