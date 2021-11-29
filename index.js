const express = require("express")
const apartmentRoute = require("../sqlApi/src/apartment/routes")
const app = express()
const port = 3000
app.use(express.json())

app.get('/', (req, res)=>{
    res.send("hello world")
})

app.use('/api/apartment', apartmentRoute)

app.listen(port, ()=>{console.log( `listening on port ${port}`)})