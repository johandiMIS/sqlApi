const pool = require("../../db")
const res = require("express/lib/response");
const { json } = require("express/lib/response");

const postSensor = function(data){
    return new Promise((resolve, reject)=>{
        // parse data    
    })
}

const InsertData = function(dataString){
    return new Promise((resolve, reject)=>{
        
        pool.query(`insert into test (testdata)
                    values ('${dataString}')`)
        .then(()=>{
            resolve({
                result:"Success",
                message: `Insert User`,
                description : ""
            })
        })
        .catch((err)=>{
            reject({
                result : "Error",
                message : `Throw Error, ${err}`,
                description : ""
            })
        })
    })
}

const InsertSensor = function(sensor, value, credential){
    return new Promise((resolve, reject)=>{
        
        pool.query(`insert into sensor (sensorType, sensorvalue,createddate,credential)
                    values ('${dataString}')`)
        .then(()=>{
            resolve({
                result:"Success",
                message: `Insert User`,
                description : ""
            })
        })
        .catch((err)=>{
            reject({
                result : "Error",
                message : `Throw Error, ${err}`,
                description : ""
            })
        })
    })
}

const SensorTypeList = function(){
    return new Promise((resolve, reject)=>{
        pool.query(`select * from sensorType`)
        .then((data)=>{
            resolve(data)
        })
        .catch(()=>{
            reject({
                errorMessage:"fail"
            })
        })
    });
}

module.exports = {
    InsertData,
    InsertSensor,
    SensorTypeList
}