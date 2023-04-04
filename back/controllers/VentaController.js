var Venta = require('../models/venta');
var DVenta = require('../models/dventa');

const registro_compra_cliente= async function(req, res){
    if (req.user) {

        var data = req.body;
        var detalles = data.detalles;
        var array_detalles = [];
        let venta = await Venta.create(data);
        detalles.forEach(async element => {
            await DVenta.create(element);
            array_detalles.push(element);
        });
        res.status(200).send({ venta: venta, dventa: array_detalles});
    } else {
        res.status(500).send({ message: 'NoAccess' })
    }
}


module.exports ={
    registro_compra_cliente
}