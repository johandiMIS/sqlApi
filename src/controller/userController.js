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

const SignUp = (req, res) =>{
    const password = req.body.password
    const username = req.body.username

    Promise.all([
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