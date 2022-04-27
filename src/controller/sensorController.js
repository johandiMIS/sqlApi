const pool = require("../../db")
const { reject, promise } = require("bcrypt/promises");
const { response } = require("express");
const userModel = require('../model/sensorModel.js');
const { connectionString } = require("pg/lib/defaults");
const res = require("express/lib/response");
const req = require("express/lib/request");

const DefaultRoute = (req, res)=>{
    res.send('invalid route');
}
const UpdateSensor = (req,res)=>{
    const credential = req.body.credential
    const data = [] 
    data = req.body.data

    res.send("updated sensor");
}
module.exports = {
    DefaultRoute,
    UpdateSensor
}