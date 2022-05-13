const pool = require("../../db")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const passwordValidator = require("password-validator");
const { reject, promise } = require("bcrypt/promises");
const { response } = require("express");
const userModel = require('../model/userModel.js');
const { connectionString } = require("pg/lib/defaults");

const DefaultRoute = (req, res)=>{
    res.send('invalid route');
}
const GetAll = (req, res) => {
    pool.query("select * from userTable", (error, result)=>{
        if(error) res.send(error) ;
        res.status(200).json(result.rows);
    })
}
const SignUp = async (req, res) =>{
    const password = req.body.password
    const username = req.body.username

    const result = await Promise.all([
        userModel.PasswordValidate(password), 
        userModel.UsernameAvailable(username), 
        userModel.PasswordEncrypt(password)
    ]) 
    .then((result) => {
        return userModel.InsertUser(username, result[2].description)
    })
    .then((result)=>{
        res.status(200).json(result)
    })
    .catch((err)=>{
        res.send(err)
    })
}

const LogIn = async (req, res)=>{
    const password = req.body.password
    const username = req.body.username
    const compareResult = await userModel.ComparePassword(username, password)

    await userModel.GetPassword(username)
    .then((result)=>{
        if(compareResult){
            return jwt.sign({result},'myWord')
        }
    })
    .then((response)=>{
        res.json({token: response})
    })
    .catch((err)=>{
        res.json(err)
    })
}

const Auth = async (req, res, next) =>{
    try{
        await userModel.JwtVerify(req.header('Authorization').replace('Bearer ',''))
        .then(()=>{
            next()
        })
        .catch(()=>{
            throw new Error("Fail Authenticate")
        })
    }
    catch{
        res.json("Fail Authenticate")
    }
}       
const Test = async (req, res)=>{
    
    res.json("sucess test")
}
module.exports = {
    DefaultRoute,
    GetAll,
    SignUp,  
    LogIn,
    Auth,
    Test
}