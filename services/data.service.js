
//import jsonwebtocken

const jwt = require('jsonwebtoken')

//import db.js
const db = require('./db')

// Database
// db = {
//     1000: { "acno": 1000, "username": "ammuz", "password": 1000, "balance": 5000, transaction: [] },
//     1001: { "acno": 1001, "username": "kalluz", "password": 1001, "balance": 5000, transaction: [] },
//     1002: { "acno": 1002, "username": "gokz", "password": 1002, "balance": 5000, transaction: [] }
// }


//register
const register = (username, acno, password) => {

    //asynchronous function
    return db.User.findOne({
        acno
    }).then(user => {
        // console.log(user);
        if (user) {
            return {
                status: false,
                message: "already registered....please log in",
                statusCode: 401
            }
        }
        else {
            //Insert in db
            const newUser = new db.User({
                acno,
                username,
                password,
                balance: 0,
                transaction: []
            })
            newUser.save()
            return {
                status: true,
                message: "registered successfully",
                statusCode: 200
            }
        }
    })


}

//login asynchronous
const login = (acno, pswd) => {
    return db.User.findOne({
        acno,
        password: pswd
    }).then(users => {
        if (users) {
            currentUser = users.username
            currentAcno = acno
            //tocken generation
            token = jwt.sign({
                //store account number inside token
                currentAcno: acno
            }, 'supersecretkey12345')

            return {
                status: true,
                message: "login successful",
                statusCode: 200,
                currentUser,
                currentAcno,
                token
            }

        }
        else {
            return {
                status: false,
                message: "invalid account number or password!!",
                statusCode: 401
            }
        }
    })
}

//deposit meathod -asynchronous
const deposit = (req,acno, password, amt) => {
    var amount = parseInt(amt)
    return db.User.findOne({
        acno, password
    }).then(user => {
        if (user) {

            if(acno != req.currentAcno){
                return{
                    status:false,
                    message:"Permission denied!!!",
                    statusCode:401
                }

              }

            user.balance += amount
            user.transaction.push({
                type: "Credit",
                amount: amount
            })
            user.save()

            return {
                status: true,
                message: amount + "deposited successfully...new balance is " + user.balance,
                statusCode: 200
            }
        }
        else {
            return {
                status: false,
                message: "invalid account number or password!!",
                statusCode: 401
            }
        }
    })


}

//withdraw meathod
const withdraw = (req,acno, password, amt) => {
    var amount = parseInt(amt)
var currentAcno=req.currentAcno
    return db.User.findOne({
        acno, password
    }).then(user => {
        if (user) {
            if(acno != currentAcno){
                return{
                    status:false,
                    message:"Permission denied!!!",
                    statusCode:401
                }

              }
            if (user.balance > amount){
                user.balance -= amount
                user.transaction.push({
                    type: "Debit",
                    amount: amount
                })
                user.save()

                return {
                    status: true,
                    message: amount + "debited successfully...new balance is " + user.balance,
                    statusCode: 200
                }
            }
            else{
                return{
                    status:false,
                    message:"insufficient balance!!!",
                    statusCode:401
                }
            }

        }
        else {
            return {
                status: false,
                message: "invalid account number or password!!",
                statusCode: 401
            }
        }
    })

}


//getTransactions meathod
const getTransaction = (acno) => {
    return db.User.findOne({
        acno
    }).then(user=>{
        if(user){
            return {
                status: true,
                statusCode: 200,
                transaction: user.transaction
            }
        }
        else{
            return {
                status: false,
                message: "user does not exit",
                statusCode: 401
            } 
        }
    })
 
}

//delete
const deleteAcc =(acno)=>{
return db.User.deleteOne({
    acno
}).then(user=>{
if(!user){
    return{
        status: false,
        message: "operation failed !!!",
        statusCode: 401  
    }
}
return{
    status: true,
        message: "sussesfully deleted !!!",
        statusCode: 200 
}
})
}
//export
module.exports = {
    register,
    login,
    deposit,
    withdraw,
    getTransaction,
    deleteAcc

}