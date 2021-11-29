const pool = require("../../db")
const getAll = (req, res) => {
    pool.query("select * from apartment", (error, result)=>{
        if(error) res.send(error) ;
        res.status(200).json(result.rows);
    })
}

module.exports = {
    getAll
}