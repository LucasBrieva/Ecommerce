'use strict'

var express = require("express");
var cuponController = require("../controllers/CuponController");

var api = express.Router();
var auth = require("../middlewares/authenticate");
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir:'./uploads/productos'})

api.post('/registro_cupon_admin', auth.auth, cuponController.registro_cupon_admin);
api.post('/listar_cupones_filtro_admin/', [auth.auth, path], cuponController.listar_cupones_filtro_admin);

api.get('/obtener_cupon_admin/:id', auth.auth, cuponController.obtener_cupon_admin);

api.put('/actualizar_cupon_admin/:id', auth.auth, cuponController.actualizar_cupon_admin);
api.put('/baja_cupon_admin/:id', auth.auth, cuponController.baja_cupon_admin);

module.exports = api;
