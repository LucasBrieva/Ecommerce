'use strict'

var express = require("express");
var clienteController = require("../controllers/ClienteController");

var api = express.Router();
var auth = require("../middlewares/authenticate");

api.post('/registro_cliente', clienteController.registro_cliente);
api.post('/login_cliente', clienteController.login_cliente);
api.post('/registro_cliente_admin', auth.auth, clienteController.registro_cliente_admin);
api.post('/listar_clientes_filtro_admin/', auth.auth, clienteController.listar_clientes_filtro_admin);

api.get('/obtener_cliente_admin/:id', auth.auth, clienteController.obtener_cliente_admin);
api.get('/obtener_cliente_guest/:id', auth.auth, clienteController.obtener_cliente_guest);

api.put('/actualizar_cliente_admin/:id', auth.auth, clienteController.actualizar_cliente_admin);
api.put('/actualizar_perfil_cliente_guest/:id', auth.auth, clienteController.actualizar_perfil_cliente_guest);
api.put('/baja_cliente_admin/:id', auth.auth, clienteController.baja_cliente_admin);

/*-------------------------------------------------*/
/*------------------DIRECCIONES--------------------*/
/*-------------------------------------------------*/

api.post('/registro_direccion_cliente', auth.auth, clienteController.registro_direccion_cliente);

module.exports = api;
