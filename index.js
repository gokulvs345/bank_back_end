//server creation

//1. import express
const express = require('express')

//2.import jsonwentoken
const jwt = require('jsonwebtoken')

//import cors
const cors = require('cors')

//import dataService
const dataService = require('./services/data.service')

//server app creation using express
const app = express()

//cors use in server app
app.use(cors({
    origin:'http://localhost:4200'
}))

//parse json data
app.use(express.json())


//application Specific middleware
const appMiddleware = (req, res, next) => {
    console.log("application specific middleware");
    next()
}

//use middeleware in app
app.use(appMiddleware)

// bank server

const jwtMiddleware = (req, res, next) => {
    //fetch token
    try {
        token = req.headers['x-access-token']
        //verify token
        const data = jwt.verify(token, 'supersecretkey12345')
        console.log(data);
        req.currentAcno = data.currentAcno
        next()
    }
    catch {
        res.status(401).json({

            status: false,
            statusCode: 401,
            message: 'please log in'
        })
    }

}


//register api
app.post('/register', (req, res) => {

    //register solving-asynchronous
    dataService.register(req.body.username, req.body.acno, req.body.password)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})


//login api asynchronous
app.post('/login', (req, res) => {

    //register solving asynchrounous
    dataService.login(req.body.acno, req.body.pswd)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
 
})

//deposit api
app.post('/deposit', jwtMiddleware, (req, res) => {

    //register solving asynchronous
    dataService.deposit(req,req.body.acno, req.body.password, req.body.amt)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
   
})


//withdraw api
app.post('/withdraw', jwtMiddleware, (req, res) => {

    //register solving
    dataService.withdraw(req,req.body.acno, req.body.password, req.body.amt)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})


//Transaction api

app.post('/transaction', jwtMiddleware, (req, res) => {

    //register solving
    dataService.getTransaction(req.body.acno)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
    
})


//deleteAcc api

app.delete('/deleteAcc/:acno',jwtMiddleware,(req,res)=>{

//delete solving
dataService.deleteAcc(req.params.acno)
.then(result=>{
    res.status(result.statusCode).json(result)
})


})

//user request resolving

//get request
app.get('/', (req, res) => {
    res.send("get request")
})
//post request
app.post('/', (req, res) => {
    res.send("post request")
})
//put request
app.put('/', (req, res) => {
    res.send("put request")
})

//patch
app.patch('/', (req, res) => {
    res.send("patch request")
})


//delete
app.delete('/', (req, res) => {
    res.send("delete request")
})



//set up port number to the server app
app.listen(3000, () => {
    console.log("Server started at 3000");
})