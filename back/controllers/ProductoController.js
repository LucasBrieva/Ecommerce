'use strict'

var Producto = require('../models/producto');
var fs = require('fs');
var path = require('path');

const registro_producto_admin = async function(req, res){
    if(req.user){
        if(req.user.role == "Gerente general"){
            let data = req.body;
            var img_path = req.files.portada.path;
            var img_name = img_path.split("\\");
            var portada_name = img_name[2];
            data.slug= data.titulo.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
            data.portada = portada_name;
            let reg = await Producto.create(data);
            res.status(200).send({data: reg});
        }else{
            res.status(500).send({message:'NoAccess'})
        }
    }else{
        res.status(500).send({message:'NoAccess'})
    }
}

const listar_productos_filtro_admin = async function(req, res){
    if(req.user){
        if(req.user.role == "Gerente general"){
            let tipo = req.params['tipo'];
            let filtro = req.params['filtro'];
            if(tipo == null || tipo == 'null'){
                let reg = await Producto.find({dadoBaja: false});
                res.status(200).send({data:reg});
            }else{
                if(tipo == 'titulo'){
                    let reg = await Producto.find({titulo:new RegExp(filtro,'i')});
                    res.status(200).send({data:reg});
                }else if(tipo == "codigo"){
                    let reg = await Producto.find({codigo:new RegExp(filtro,'i')});
                    res.status(200).send({data:reg});
                }/*else if(tipo == 'categoria'){
                    let reg = await Producto.find({categoria:new RegExp(filtro,'i')});
                    res.status(200).send({data:reg});
                }*/
            }
        }else{
            res.status(500).send({message:'NoAccess'})
        }
    }else{
        res.status(500).send({message:'NoAccess'})
    }
}

const obtener_portada = async function(req,res){
    var img = req.params['img'];
    fs.stat('./uploads/productos/' + img, function(error){
        if(!error){
            let path_img = './uploads/productos/' + img;
            res.status(200).sendFile(path.resolve(path_img));
        }else{
            let path_img = './uploads/default-product';
            res.status(200).sendFile(path.resolve(path_img));
        }
    });
}

const obetener_producto_admin = async function (req, res){
    if(req.user){
        if(req.user.role == "Gerente general"){
            var id = req.params['id'];
            try{
                var reg = await Producto.findById({_id:id});
                res.status(200).send({data:reg});
            }catch (error){
                res.status(200).send({data:undefined});
            }
        }else{
            res.status(500).send({message: 'Hubo un error en el servidor',data: undefined});
        }
    }else{
        res.status(500).send({message: 'Hubo un error en el servidor',data: undefined});
    }
}

const actualizar_producto_admin = async function(req, res){
    if(req.user){
        if(req.user.role == "Gerente general"){
            let id = req.params['id']; 
            let data = req.body;

            if(req.files){
                //SI HAY IMAGEN
                var img_path = req.files.portada.path;
                var img_name = img_path.split("\\");
                var portada_name = img_name[2];


                let reg = await Producto.findByIdAndUpdate({_id: id},{
                    titulo : data.titulo,
                    codigo : data.codigo,
                    categoria : data.categoria,
                    stock : data.stock,
                    precio : data.precio,
                    descripcion : data.descripcion,
                    contenido : data.contenido,
                    portada : portada_name,
                });
                //BORRO LA IMG PARA QUE NO ME ACUMULE INFO BASURA EN LA BD
                fs.stat('./uploads/productos/' + reg.portada, function(error){
                    if(!error){
                        fs.unlink('./uploads/productos/' + reg.portada, (err)=> {
                            if(err) throw err;
                        });
                    }
                });


                res.status(200).send({data:reg});

            } else{
                //NO HAY IMAGEN
                let reg = await Producto.findByIdAndUpdate({_id: id},{
                    titulo : data.titulo,
                    codigo : data.codigo,
                    categoria : data.categoria,
                    stock : data.stock,
                    precio : data.precio,
                    descripcion : data.descripcion,
                    contenido : data.contenido,
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

module.exports = {
    registro_producto_admin,
    listar_productos_filtro_admin,
    obtener_portada,
    obetener_producto_admin,
    actualizar_producto_admin
}