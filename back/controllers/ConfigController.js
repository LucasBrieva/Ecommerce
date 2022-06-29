var Config = require('../models/config');
var fs = require('fs');
var path = require('path');

const obtener_config_admin = async function(req,res){
    if(req.user){
        if(req.user.role == "Gerente general"){
            let reg = await Config.findById({_id:"62bb9a6476aaee93706e83c1"});
            res.status(200).send({data:reg});
        }else{
            res.status(500).send({message:'NoAccess'})
        }
    }else{
        res.status(500).send({message:'NoAccess'})
    }
}
const registrar_config_admin = async function(req,res){
    if(req.user){

        await Config.create({
            categorias: [],
            razonSocial: "Default",
            logo: "Default",
            nSerie: "0001",
            correlativo: "000001"
        })
    }
}
const actualizar_config_admin = async function(req,res){
    if(req.user){
        if(req.user.role == "Gerente general"){
            let data = req.body;

            if(req.files){
                var img_path = req.files.logo.path;
                var img_name = img_path.split("\\");
                var logo_name = img_name[2];

                let reg = await Config.findByIdAndUpdate({_id:"62bb9a6476aaee93706e83c1"},{
                    categorias: JSON.parse(data.categorias),
                    razonSocial: data.razonSocial,
                    logo: logo_name,
                    nSerie: data.nSerie,
                    correlativo: data.correlativo,
                });
                fs.stat('./uploads/configuraciones/' + reg.logo, function(error){
                    if(!error){
                        fs.unlink('./uploads/configuraciones/' + reg.logo, (err)=> {
                            if(err) throw err;
                        });
                    }
                });
                res.status(200).send({data:reg});
            }
            else{
                let reg = await Config.findByIdAndUpdate({_id:"62bb9a6476aaee93706e83c1"},{
                    categorias: data.categorias,
                    razonSocial: data.razonSocial,
                    nSerie: data.nSerie,
                    correlativo: data.correlativo,
                });
                res.status(200).send({data:reg});
            }
        }else{
            res.status(500).send({message:'NoAccess'})
        }
    }else{
        res.status(500).send({message:'NoAccess'})
    }
}
const obtener_logo = async function(req,res){
    var img = req.params['img'];
    fs.stat('./uploads/configuraciones/' + img, function(error){
        if(!error){
            let path_img = './uploads/configuraciones/' + img;
            res.status(200).sendFile(path.resolve(path_img));
        }else{
            let path_img = './uploads/default-product';
            res.status(200).sendFile(path.resolve(path_img));
        }
    });
}
const obtener_config_public = async function(req,res){
    let reg = await Config.findById({_id:"62bb9a6476aaee93706e83c1"});
    res.status(200).send({data:reg});
} 
module.exports={
    actualizar_config_admin,
    obtener_config_admin,
    obtener_logo,
    registrar_config_admin,
    obtener_config_public
}