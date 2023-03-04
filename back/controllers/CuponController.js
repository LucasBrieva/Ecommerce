var Cupon = require('../models/cupon');
var fsHelper = require('../helpers/fsHelper');

const registro_cupon_admin = async function(req, res){
    if(req.user){
        if(req.user.role == 'Gerente general'){

            let data = req.body;
            console.log(data);
            let reg = await Cupon.create(data);

            res.status(200).send({data:reg});
        }else{
            fsHelper.add_log("CuponController.js", "Hubo un error en CuponController.registro_cupon_admin, no tiene permiso por rol");
            res.status(500).send({message:'NoAccess'})
        }
    }else{
        fsHelper.add_log("CuponController.js", "Hubo un error en CuponController.registro_cupon_admin, no llego el usuario");
        res.status(500).send({message:'NoAccess'})
    }
}

const listar_cupones_filtro_admin = async function(req, res){
    if(req.user){
        if(req.user.role == "Gerente general"){
            let data = req.body;
            if(data.tipo != ""){
                let reg = await Cupon.find({tipo:data.tipo, codigo:new RegExp(data.codigo,'i'), dadoBaja: false});
                res.status(200).send({data:reg});
            }
            else{
                let reg = await Cupon.find({codigo:new RegExp(data.codigo,'i'), dadoBaja: false});
                res.status(200).send({data:reg});
            }
            
        }else{
            fsHelper.add_log("CuponController.js", "Hubo un error en CuponController.listar_cupones_filtro_admin, no tiene permiso por rol");
            res.status(500).send({message:'NoAccess'})
        }
    }else{
        fsHelper.add_log("CuponController.js", "Hubo un error en CuponController.listar_cupones_filtro_admin, no llego el usuario");
        res.status(500).send({message:'NoAccess'})
    }
}

const obtener_cupon_admin = async function (req, res){
    if(req.user){
        if(req.user.role == "Gerente general"){
            var id = req.params['id'];
            try{
                var reg = await Cupon.findById({_id:id});
                res.status(200).send({data:reg});
            }catch (error){
                res.status(200).send({data:undefined});
            }
        }else{
            fsHelper.add_log("CuponController.js", "Hubo un error en CuponController.obtener_cupon_admin, no tiene permiso por rol");
            res.status(500).send({message: 'Hubo un error en el servidor',data: undefined});
        }
    }else{
        fsHelper.add_log("CuponController.js", "Hubo un error en CuponController.obtener_cupon_admin, no llego el usuario");
        res.status(500).send({message: 'Hubo un error en el servidor',data: undefined});
    }
}

const actualizar_cupon_admin = async function(req,res){
    if(req.user){
        if(req.user.role == "Gerente general"){
            var id = req.params['id'];
            var data = req.body;
            var reg = await Cupon.findByIdAndUpdate({_id:id},{
                codigo: data.codigo,
                valor: data.valor,
                limite:data.limite,
                vencimiento: data.vencimiento,
                tipo: data.tipo,
            });
            res.status(200).send({data:reg});
        }else{
            fsHelper.add_log("CuponController.js", "Hubo un error en CuponController.actualizar_cupon_admin, no tiene permiso por rol");
            res.status(500).send({message: 'NoAccess',data: undefined});
        }
    }else{
        fsHelper.add_log("CuponController.js", "Hubo un error en CuponController.actualizar_cupon_admin, no llego el usuario");
        res.status(500).send({message: 'NoAccess',data: undefined});
    }
}

const baja_cupon_admin = async function(req, res){
    if(req.user){
        if(req.user.role == "Gerente general"){
            var id = req.params['id'];
            var reg = await Cupon.findByIdAndUpdate({_id:id},{
                dadoBaja: true
            });
            res.status(200).send({data:reg});
        }else{
            fsHelper.add_log("CuponController.js", "Hubo un error en CuponController.baja_cupon_admin, no tiene permiso por rol");
            res.status(500).send({message: 'NoAccess',data: undefined});
        }
    }else{
        fsHelper.add_log("CuponController.js", "Hubo un error en CuponController.baja_cupon_admin, no llego el usuario");
        res.status(500).send({message: 'NoAccess',data: undefined});
    }
}

module.exports ={
    registro_cupon_admin,
    listar_cupones_filtro_admin,
    obtener_cupon_admin,
    actualizar_cupon_admin,
    baja_cupon_admin
}