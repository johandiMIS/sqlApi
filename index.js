const express = require("express")
const userRoute = require('../sqlApi/src/route/userRoute')
const sensorRoute = require('../sqlApi/src/route/sensorRoute')
const app = express()
const port = process.env.PORT || 3000
app.use(express.json())


app.use('/api/user/', userRoute);
app.use('/api/sensor', sensorRoute);
app.get('/*', (req, res)=>{
    res.send("hello world")
})
app.post('/*', (req, res)=>{
    res.send("hello world")
})

app.listen(port, ()=>{console.log( `listening on port ${port}`)})