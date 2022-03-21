const pool = require("../../db")
const bcrypt = require("bcrypt")
const passwordValidator = require("password-validator");
const { reject, promise } = require("bcrypt/promises");
const { response } = require("express");
const DefaultRoute = (req, res)=>{
    res.send('invalid route');
}
const GetAll = (req, res) => {
    pool.query("select * from userTable", (error, result)=>{
        if(error) res.send(error) ;
        res.status(200).json(result.rows);
    })
}

const SignUp = async (req, res) => {
    // get request body with user role default = 0 (regular user)
    const username = req.body.username
    const password = req.body.password
    let hashPassword = "";
    var schema = new passwordValidator()

    // check if username already used
    await pool.query(`select count(*) from userTable where username = '${username}'`)
    .then((result)=>{
        return JSON.parse(result.rows[0].count)
    })
    .then((count)=>{
        // check if username format correct or already used
        if (count != 0) {
            throw (
                {
                    result : "error",
                    message : `Username ${username} already used`,
                    description : ""
                }
            )
        }
        if (username.length <= 0){
            throw({
                result : "error",
                message : `incorrect format`,
                description:""
            })
        } 
    })
    .then(()=>{
        // build password schema
        schema
        .is().min(8)
        .is().max(30)
        .has().uppercase()
        .has().lowercase()
        .has().digits()
        .has().symbols()
        .has().not().spaces()
        .is().not().oneOf([username]);
    })
    .then(()=>{
        // check password format
        if(schema.validate(password) == false) throw ({
            result: "error",
            message: "Password format invalid",
            description: schema.validate(password, {details:true}) 
        })
    })
    .then(()=>{
        // encrypt password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt)
        hashPassword = hash;
    })
    .then(() => {
        try{
            pool.query(`insert into userTable (username, hashPassword, userRole)
                        values ('${username}','${hashPassword}', 0)`)

            res.json({
                result:"success",
                message: "insert user data to database",
                description : {
                    name: username
                }
            })    
        }catch{
            throw({
                result:"error",
                message: "failed insert user data to database",
                description : {
                    name: username
                }
            })
        }
    })
    .catch((error)=>{
        res.json(error)
    })
}

const SignUp2 = async (req, res) =>{
    const password = req.body.password
    const username = req.body.username
    const hashPassword =''
    var schema = new passwordValidator()
    .is().min(8)
    .is().max(30)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().symbols()
    .has().not().spaces()
    .is().not().oneOf([username]);

    
    const PasswordValidate = (schema, password)=>{
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

    const UserQuery = (username)=>{
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

    const InsertUser = function(username, hashPassword){
        return new Promise((resolve, reject)=>{
            
            pool.query(`insert into userTable (username, hashPassword, userRole)
                        values ('${username}','${hashPassword}', 0)`)
            .then((res)=>{
                resolve({
                    result:"Success",
                    message: `Insert User, ${res}`,
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

    await Promise.all([PasswordValidate(schema, password),  UserQuery(username), GetHash(password)]) 
    .then( async (response) => {
        return await InsertUser(username, response[2].description)
    })
    .then((res)=>{
        res.status(200).json(res)
    })
    .catch((err)=>{
        res.send(err)
    })
}

module.exports = {
    DefaultRoute,
    GetAll,
    SignUp,
    SignUp2
}