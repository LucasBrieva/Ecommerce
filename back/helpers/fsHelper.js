'use strict'

var fs = require('file-system');
var dateNow = Date.now().toLocaleString();
var path = "C:/Tienda/tienda/logs/" + dateNow + ".txt";

const add_log = async function (message){
    console.log(Date.now);
    console.log("LLEGA ACÁ\nLA RUTA ES: " + path);
    if(fs.fs.existsSync(path)){
        fs.fs.appendFile(path, message + "\n");
        console.log("AGREGA EL NUEVO MSJ");
    }else{
        fs.writeFile(path, message + "\n");
        console.log("CREA EL ARCHIVO Y EL 1ER MSJ");
    }
}


module.exports = {
    add_log
};