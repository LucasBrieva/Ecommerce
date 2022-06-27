'use strict'

var express = require("express");
var cuponController = require("../controllers/CuponController");

var api = express.Router();
var auth = require("../middlewares/authenticate");
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir:'./uploads/productos'})

api.post('/registro_cupon_admin', auth.auth, cuponController.registro_cupon_admin);
api.post('/listar_cupones_filtro_admin/', [auth.auth, path], cuponController.listar_cupones_filtro_admin);

module.exports = api;
