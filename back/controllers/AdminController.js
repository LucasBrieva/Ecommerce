'use strict'

var Admin = require('../models/admin');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');
var fsHelper = require('../helpers/fsHelper');

const registro_admin = async function(req, res){
    var data = req.body;
    var admin_arr = [];

    admin_arr = await Admin.find({email:data.email});

    if(admin_arr.length == 0){
        if(data.password){
            bcrypt.hash(data.password, null, null, async function(err, hash){
                 if(hash){
                     data.password = hash;
                    var reg = await Admin.create(data);
                    res.status(200).send({data: reg});
                 }
                 else{
                    fsHelper.add_log("AdminController.js", "Hubo un error en AdminController.registro_admin, ErrorServer");
                    res.status(500).send({message: 'ErrorServer',data: undefined});
                 }
            });
        }else{
            fsHelper.add_log("AdminController.js", "Hubo un error en AdminController.registro_admin, no hay una contraseña");

            res.status(500).send({message: 'No hay una contraseña',data: undefined});
        }
    }
    else{
        fsHelper.add_log("AdminController.js", "Hubo un error en AdminController.registro_admin, El correo ya existe en la base de datos");
        res.status(500).send({message: 'El correo ya existe en la base de datos',data: undefined});
    }
    
}

const login_admin = async function(req, res){
    var data = req.body;
    var admin_arr = [];

    admin_arr = await Admin.find({email: data.email});

    if(admin_arr.length == 0){
        fsHelper.add_log("AdminController.js", "Hubo un error en AdminController.login_admin, No se encontró el correo");
        res.status(400).send({message: "No se encontró el correo", data: undefined});

    }else{
        let user = admin_arr[0];

        // res.status(200).send({
        //     data: user,
        //     token: jwt.createToken(user)
        // });
        bcrypt.compare(data.password, user.password, async function(error, check){
            if(check){
                res.status(200).send({
                    data: user,
                    token: jwt.createToken(user)
                });
            }
            else{
                fsHelper.add_log("AdminController.js", "Hubo un error en AdminController.login_admin, La contraseña no coincide");
                res.status(400).send({message: "La contraseña no coincide", data: undefined});
            }
        });
        
    }
}


module.exports = {
    registro_admin,
    login_admin
}
