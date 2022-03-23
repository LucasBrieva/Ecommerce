var Cupon = require('../models/cupon');

const registro_cupon_admin = async function(req, res){
    if(req.user){
        if(req.user.role == 'Gerente general'){

            let data = req.body;
            let reg = await Cupon.create(data);

            res.status(200).send({data:reg});
        }else{
            res.status(500).send({message:'NoAccess'})
        }
    }else{
        res.status(500).send({message:'NoAccess'})
    }
}

module.exports ={
    registro_cupon_admin
}