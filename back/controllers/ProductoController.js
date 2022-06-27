'use strict'

var Producto = require('../models/producto');
var Inventario = require('../models/inventario');
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

            let inventario = await Inventario.create({
                admin: req.user.sub, 
                cantidad: reg.stock,
                proveedor: 'Primer registro',
                producto: reg._id,
                tipo: true
            })

            res.status(200).send({data: reg, inventario:inventario});
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
            let data = req.body;
            let reg = await Producto.find({titulo:new RegExp(data.titulo,'i'), codigo:new RegExp(data.codigo,'i'), dadoBaja: new RegExp(false,'i')});
            res.status(200).send({data:reg});
            
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

const baja_producto_admin = async function(req, res){
    if(req.user){
        if(req.user.role == "Gerente general"){
            var id = req.params['id'];
            var reg = await Producto.findByIdAndUpdate({_id:id},{
                dadoBaja: true
            });
            res.status(200).send({data:reg});
        }else{
            res.status(500).send({message: 'Hubo un error en el servidor',data: undefined});
        }
    }else{
        res.status(500).send({message: 'Hubo un error en el servidor',data: undefined});
    }
}

/* INVENTARIO */
const listar_inventario_producto_admin = async function(req, res){
    if(req.user){
        if(req.user.role == "Gerente general"){
            var id = req.params['id'];
            var reg = await Inventario.find({producto: id}).populate('admin');
            res.status(200).send({data:reg});
        }else{
            res.status(500).send({message: 'Hubo un error en el servidor',data: undefined});
        }
    }else{
        res.status(500).send({message: 'Hubo un error en el servidor',data: undefined});
    }
}

const registro_inventario_producto_admin = async function(req, res){
    if(req.user){
        if(req.user.role == "Gerente general"){
            var data = req.body;
            //Seteo el admin
            data.admin = req.user.sub;
            //Creo el nuevo reg de inventario
            let reg = await Inventario.create(data);
            //Voy a buscar el producto a la bd para obtener el stock
            let prod = await Producto.findById({_id:reg.producto});
            //Verifico el tipo del registro, para saber si aumento o bajo el stock del producto.
            var producto = await Producto.findByIdAndUpdate({_id: reg.producto._id},{
                stock: data.tipo == "true"? Number.parseInt(prod.stock + data.cantidad) : Number.parseInt(prod.stock - data.cantidad),
            });
            res.status(200).send({data: reg, producto:producto});
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
    actualizar_producto_admin,
    baja_producto_admin, 
    listar_inventario_producto_admin,
    registro_inventario_producto_admin
}