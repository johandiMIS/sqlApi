const { json } = require("body-parser")
const bcrypt = require("bcrypt")
const { user } = require("pg/lib/defaults")
const passwordValidator = require("password-validator")
const pool = require("../../db")


const signUp = async (req, res) => {
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
        console.log("last")
        res.json(error)
    })
}


module.exports = {
    signUp
}