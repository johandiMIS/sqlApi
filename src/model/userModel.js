const pool = require("../../db")
const bcrypt = require("bcrypt")
const passwordValidator = require("password-validator");
const res = require("express/lib/response");
const { json } = require("express/lib/response");

const GetHash = function(password){
    return new Promise((resolve, reject)=>{
        bcrypt.genSalt(10, function(err, salt) {
            if(err){
                reject({
                    result : "Error",
                    message : `Failed Generate Salt`,
                    description : ""
                })
            }
            else{
                bcrypt.hash(password, salt, function(err, hash) {
                    if(err){
                        reject({
                            result : "Error",
                            message : `Failed Encrypt Password`,
                            description : ""
                        })
                    }
                    else{
                        resolve({
                            result : "Success",
                            message : `Password encrypted`,
                            description : hash
                        })
                    }
                });
            }
        });
    })
}

const PasswordValidate = (password)=>{
    var schema = new passwordValidator()
    .is().min(8)
    .is().max(30)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().symbols()
    .has().not().spaces();

    return new Promise((resolve, reject)=>{
        if(schema.validate(password) === true){
            resolve({
                result: "Success",
                message: "Password Valid",
                description : ""
            })
        }
        else{
            reject({
                result: "Error",
                message: "Password Format Invalid",
                description: schema.validate(password, {details:true}) 
            })
        }
    })
}

const UsernameAvailable = (username)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`select count(*) from userTable where username = '${username}'`)
        .then((res)=>{
            if(JSON.parse(res.rows[0].count) <= 0) resolve({
                result: "Success",
                message: "Username Valid",
                description : {
                    name: username
                }
            })
            else{
                reject({
                    result : "Error",
                    message : `Username ${username} Already Used`,
                    description : ""
                })
            }
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

const PasswordEncrypt = function(password){
    return new Promise((resolve, reject)=>{
        bcrypt.genSalt(10, function(err, salt) {
            if(err){
                reject({
                    result : "Error",
                    message : `Failed Generate Salt`,
                    description : ""
                })
            }
            else{
                bcrypt.hash(password, salt, function(err, hash) {
                    if(err){
                        reject({
                            result : "Error",
                            message : `Failed Encrypt Password`,
                            description : ""
                        })
                    }
                    else{
                        resolve({
                            result : "Success",
                            message : `Password encrypted`,
                            description : hash
                        })
                    }
                });
            }
        });
    })
}

const InsertUser = function(username, hashPassword){
    return new Promise((resolve, reject)=>{
        
        pool.query(`insert into userTable (username, hashPassword, userRole)
                    values ('${username}','${hashPassword}', 0)`)
        .then((res)=>{
            resolve({
                result:"Success",
                message: `Insert User`,
                description : {
                    name: username
                }
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

const GetPassword = function (username){
    return new Promise((resolve, reject)=>{
        pool.query(`select * from userTable where username = '${username}' order by userNumber `, (error, result)=>{
            if(error) reject({
                result : "Error",
                message : `Throw Error, ${err}`,
                description : ""
            })
            else resolve({
                result : "Success",
                message : `${result}`,
                description : ""
            })
        })
    })
}
        // .then((res)=>{
        //     resolve(res)
            // if(JSON.parse(res.rows[0].count) > 0) resolve({
            //     result: "Success",
            //     message: "Username Valid",
            //     description : hashPassword
            // })
            // else{
            //     reject({
            //         result : "Error",
            //         message : `Username ${username} Not Found`,
            //         description : ""
            //     })
            // }
    //     })
    //     .catch((err)=>{
    //         reject({
    //             result : "Error",
    //             message : `Throw Error, ${err}`,
    //             description : ""
    //         })
    //     })
    // })
// }

module.exports = {
    GetHash,
    PasswordValidate,
    UsernameAvailable,
    PasswordEncrypt,
    InsertUser,
    GetPassword
}