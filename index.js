const express = require("express")
const apartmentRoute = require("../sqlApi/src/apartment/routes")
const userRoute = require('../sqlApi/src/route/userRoute')
const app = express()
const port = process.env.PORT || 3000
app.use(express.json())

app.get('/', (req, res)=>{
    res.send("hello world")
})

// app.use('/api', apartmentRoute)
app.use('/api/user/', userRoute);

app.listen(port, ()=>{console.log( `listening on port ${port}`)})