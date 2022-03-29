const pool = require("../../db")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const passwordValidator = require("password-validator");
const { reject, promise } = require("bcrypt/promises");
const { response } = require("express");
const userModel = require('../model/userModel.js')

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

    const userData = await userModel.GetPassword(username)
    .then((result)=>{
        if(compareResult){
            return jwt.sign({result},'myWord')
        }
    })
    
    .then((result)=>{
        console.log(result)
        return jwt.verify(result,'myWord')
    })
    .then((response)=>{
        console.log(response[0])
        res.json(response)
    })
    .catch((err)=>{
        res.json(err)
    })


    // Promise.all([
    //     userModel.ComparePassword(username, password)
    // ])
    // .then((result)=>{
    //     console.log(result)
    //     res.json(result[0][0])
    // })
    // .catch((err)=>{
    //     console.log(err)
    //     res.json(result)
    // })

    
}

module.exports = {
    DefaultRoute,
    GetAll,
    SignUp,
    LogIn
}