'use strict'

var fs = require('file-system');
var moment = require('moment');
var dateNow = moment().format("DD_MM_yyyy");
var path = "C:/Tienda/Ecommerce/tienda/logs/" + dateNow + ".txt";

const add_log = async function (from, message) {
    console.log("LLEGA ACÁ\nLA RUTA ES: " + path);
    var msj = moment().hour() + ":" + moment().minutes() + " - Mensaje proveniente de " + from + ": " + message;
    if (fs.fs.existsSync(path)) {
        fs.fs.appendFile(path, msj + "\n", (error) => {
            console.log("ERROR:" + error);
        });
    } else {
        fs.writeFile(path, msj + "\n");
    }
}


module.exports = {
    add_log
};