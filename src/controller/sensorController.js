const pool = require("../../db")
const { reject, promise } = require("bcrypt/promises");
const { response } = require("express");
const sensorModel = require('../model/sensorModel.js');
const { connectionString } = require("pg/lib/defaults");
const res = require("express/lib/response");
const req = require("express/lib/request");

const DefaultRoute = (req, res)=>{
    res.send('invalid sensor route');
}
const UpdateSensor = async (req,res)=>{
    const credential = req.body.credential
    const dataJson = req.body.data

    var result = ""
    
    result += `credential = ${credential}\n`
    for (var key in dataJson)
    {
        var value = dataJson[`${key}`]
        result += `${key} = ${value}\n`
        
    }
    console.log(result)
    res.send(`${result}`);

}
module.exports = {
    DefaultRoute,
    UpdateSensor
}