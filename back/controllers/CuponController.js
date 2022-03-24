var Cupon = require('../models/cupon');

const registro_cupon_admin = async function(req, res){
    if(req.user){
        if(req.user.role == 'Gerente general'){

            let data = req.body;
            console.log(data);
            let reg = await Cupon.create(data);

            res.status(200).send({data:reg});
        }else{
            res.status(500).send({message:'NoAccess'})
        }
    }else{
        res.status(500).send({message:'NoAccess'})
    }
}

const listar_cupones_filtro_admin = async function(req, res){
    if(req.user){
        if(req.user.role == "Gerente general"){
            let tipo = req.params['tipo'];
            let filtro = req.params['filtro'];
            if(tipo == null || tipo == 'null'){
                let reg = await Cupon.find();
                res.status(200).send({data:reg});
            }else{
                if(tipo == 'codigo'){
                    let reg = await Cupon.find({codigo:new RegExp(filtro,'i')});
                    res.status(200).send({data:reg});
                }
            }
        }else{
            res.status(500).send({message:'NoAccess'})
        }
    }else{
        res.status(500).send({message:'NoAccess'})
    }
}
module.exports ={
    registro_cupon_admin,
    listar_cupones_filtro_admin
}