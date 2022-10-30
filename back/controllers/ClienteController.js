'use strict'

var Cliente = require('../models/cliente');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');
var fsHelper = require('../helpers/fsHelper');
const registro_cliente = async function(req, res){
    var data = req.body;
    var clientes_arr = [];

    clientes_arr = await Cliente.find({email:data.email});
    if(clientes_arr.length == 0){
        if(data.password){
            bcrypt.hash(data.password, null, null, async function(err, hash){
                 if(hash){
                     data.password = hash;
                    var reg = await Cliente.create(data);
                    console.log(reg);
                    res.status(200).send({data: reg,
                        token: jwt.createToken(reg)});
                 }
                 else{
                    res.status(403).send({message: 'ErrorServer',data: undefined});
                 }
            });
        }else{
            res.status(400).send({message: 'No hay una contraseña',data: undefined});
        }
    }
    else{
        res.status(400).send({message: 'El correo ya existe en la base de datos',data: undefined});
    }
    
}
const listar_clientes_filtro_admin = async function(req, res){
    if(req.user){
        if(req.user.role == "Gerente general"){
            let data = req.body;
            let reg = await Cliente.find({nombres:new RegExp(data.nombre,'i'),email:new RegExp(data.correo,'i'), apellidos:new RegExp(data.apellido,'i'),dadoBaja: false});
            res.status(200).send({data:reg});
        
        }else{
            res.status(500).send({message:'NoAccess'})
        }
    }else{
        res.status(500).send({message:'NoAccess'})
    }
}

const login_cliente = async function(req, res){
    var data = req.body;
    var cliente_arr = [];

    cliente_arr = await Cliente.find({email: data.email});
    if(cliente_arr.length == 0){
        res.status(400).send({message: "No se encontró el correo", data: undefined});

    }else{
        let user = cliente_arr[0];

        bcrypt.compare(data.password, user.password, async function(error, check){
            if(check){
                if(user.dadoBaja == "false"){
                    res.status(200).send({
                        data: user,
                        token: jwt.createToken(user)
                    });
                }
                else{
                    res.status(400).send({message: "El usuario está dado de baja", data: undefined});
                }
            }
            else{
                res.status(400).send({message: "La contraseña no coincide", data: undefined});
            }
        });
        
    }
}

const registro_cliente_admin = async function(req, res){
    if(req.user){
        if(req.user.role == "Gerente general"){
            var data = req.body;

            bcrypt.hash('123456789', null, null, async function(err, hash){
                if(hash){
                    data.password = hash;
                    let reg = await Cliente.create(data);
                    res.status(200).send({data:reg});
                }
            })
        }else{
            res.status(500).send({message: 'Hubo un error en el servidor',data: undefined});
        }
    }
    else{
        res.status(500).send({message: 'Hubo un error en el servidor',data: undefined});
    }
}

const obtener_cliente_admin = async function (req, res){
    if(req.user){
        if(req.user.role == "Gerente general"){
            var id = req.params['id'];
            try{
                var reg = await Cliente.findById({_id:id});
                res.status(200).send({data:reg});
            }catch (error){
                res.status(500).send({message: 'Hubo un error en el servidor', data:undefined});
            }
        }else{
            res.status(500).send({message: 'Hubo un error en el servidor',data: undefined});
        }
    }else{
        res.status(500).send({message: 'Hubo un error en el servidor',data: undefined});
    }
}

const actualizar_cliente_admin = async function(req,res){
    if(req.user){
        if(req.user.role == "Gerente general"){
            var id = req.params['id'];
            var data = req.body;
            var reg = await Cliente.findByIdAndUpdate({_id:id},{
                nombres: data.nombres,
                apellidos: data.apellidos,
                email:data.email,
                telefono: data.telefono,
                f_nacimiento: data.f_nacimiento,
                genero: data.genero,
                dni: data.dni,
            });
            res.status(200).send({data:reg});
        }else{
            res.status(500).send({message: 'Hubo un error en el servidor',data: undefined});
        }
    }else{
        res.status(500).send({message: 'Hubo un error en el servidor',data: undefined});
    }
}

const baja_cliente_admin = async function(req, res){
    if(req.user){
        if(req.user.role == "Gerente general"){
            var id = req.params['id'];
            var reg = await Cliente.findByIdAndUpdate({_id:id},{
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

const obtener_cliente_guest = async function (req, res){
    if(req.user){
        var id = req.params['id'];
        try{
            var reg = await Cliente.findById({_id:id});
            res.status(200).send({data:reg});
        }catch (error){
            res.status(500).send({message: 'Hubo un error en el servidor', data:undefined});
        }
    }else{
        res.status(500).send({message: 'Hubo un error en el servidor',data: undefined});
    }
}
const actualizar_perfil_cliente_guest = async function (req, res){
    if(req.user){
        var id = req.params['id'];
        var data = req.body;
        if(data.newPassword){
            console.log("Por aca no se actualizo la pass")
            bcrypt.hash(data.newPassword, null, null, async function(err, hash){
                var reg = await Cliente.findByIdAndUpdate({_id:id},{
                    nombres: data.nombres,
                    apellidos: data.apellidos,
                    email: data.email,
                    telefono: data.telefono,
                    f_nacimiento: data.f_nacimiento,
                    dni: data.dni,
                    genero: data.genero,
                    pais: data.pais,
                    password: hash,
                });
            res.status(200).send({data:reg});
            });
        }else{
            console.log("Por aca SÍ actualizo la pass")
            var reg = await Cliente.findByIdAndUpdate({_id:id},{
                nombres: data.nombres,
                apellidos: data.apellidos,
                email: data.email,
                telefono: data.telefono,
                f_nacimiento: data.f_nacimiento,
                dni: data.dni,
                genero: data.genero,
                pais: data.pais,
            });
            res.status(200).send({data:reg});
        }
        fsHelper.add_log("Test");
    }else{
        res.status(500).send({message: 'Hubo un error en el servidor',data: undefined});
    }
}


module.exports = {
    registro_cliente,
    login_cliente,
    listar_clientes_filtro_admin,
    registro_cliente_admin,
    obtener_cliente_admin,
    actualizar_cliente_admin,
    baja_cliente_admin,
    obtener_cliente_guest,
    actualizar_perfil_cliente_guest
}
