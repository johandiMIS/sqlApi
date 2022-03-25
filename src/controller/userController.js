const pool = require("../../db")
const bcrypt = require("bcrypt")
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

    await Promise.all([
        userModel.PasswordValidate(password), 
        userModel.UsernameAvailable(username), 
        userModel.PasswordEncrypt(password)
    ]) 
    .then( async (response) => {
        userModel.InsertUser(username, response[2].description)
    })
    .then((res)=>{
        res.status(200).json(res)
    })
    .catch((err)=>{
        res.send(err)
    })
}

const LogIn = async (req, res)=>{
    const password = req.body.password
    const username = req.body.username

    userModel.GetPassword(username)
    .then((res)=>[
        res.send (res)
    ])
    .catch((err)=>{
        console.log(err)
        res.send(err)
    })


}
module.exports = {
    DefaultRoute,
    GetAll,
    SignUp,
    LogIn
}