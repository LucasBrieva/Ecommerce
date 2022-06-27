'use strict'

var express = require("express");
var clienteController = require("../controllers/ClienteController");

var api = express.Router();
var auth = require("../middlewares/authenticate");
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir:'./uploads/productos'})

api.post('/registro_cliente', clienteController.registro_cliente);
api.post('/login_cliente', clienteController.login_cliente);
api.post('/registro_cliente_admin', auth.auth, clienteController.registro_cliente_admin);
api.post('/listar_clientes_filtro_admin/', [auth.auth, path], clienteController.listar_clientes_filtro_admin);

api.get('/obetener_cliente_admin/:id', auth.auth, clienteController.obetener_cliente_admin);

api.put('/actualizar_cliente_admin/:id', auth.auth, clienteController.actualizar_cliente_admin);
api.put('/baja_cliente_admin/:id', auth.auth, clienteController.baja_cliente_admin);


module.exports = api;
