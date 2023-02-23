var Carrito = require('../models/carrito');

const agregar_carrito_cliente = async function (req, res) {
    if (req.user) {
        let data = req.body;

        let carrito_cliente = await Carrito.find({ cliente: data.cliente, producto: data.producto });

        if (carrito_cliente.length == 0) {
            let reg = await Carrito.create(data);
            res.status(200).send({ data: reg });
        }else if(carrito_cliente.length >= 0){
            //TODO: Esto lo puedo manejar de otra manera, para que si lo vuelve a agregar que se sume al anterior, se haría sencillo con un findandupdate
            res.status(200).send({ data: undefined });
        }


    } else {
        fsHelper.add_log("ClienteController.js", "Hubo un error en ClienteController.listar_clientes_filtro_admin");
        res.status(500).send({ message: 'NoAccess' })
    }
}

module.exports = {
    agregar_carrito_cliente
}