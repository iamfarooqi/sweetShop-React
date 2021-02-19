var express = require("express");
var bcrypt = require("bcrypt-inzi")
var jwt = require('jsonwebtoken');
var { userModel } = require("../dbrepo/models");
var { SERVER_SECRET } = require("../core/index");
var api = express.Router();




//******* SIGNUP ********//


api.post("/signup", (req, res, next) => {

    if (!req.body.name
        || !req.body.email
        || !req.body.password
        // || !req.body.phone
        // || !req.body.gender
    ) {

        res.status(403).send(`
            please send name, email, password, phone in json body.
            e.g:
            {
                "name": "farooqi",
                "email": "farooq@gmail.com",
                "password": "12345",
              
               
                
            }`)
        return;
    }
    userModel.findOne({ email: req.body.email },
        function (err, doc) {
            if (!err && !doc) {

                bcrypt.stringToHash(req.body.password).then(function (hash) {

                    var newUser = new userModel({
                        "name": req.body.name,
                        "email": req.body.email,
                        "password": hash,
                        // "phone": req.body.phone,
                        // "gender": req.body.gender,
                    })
                    newUser.save((err, data) => {
                        if (!err) {
                            res.send({
                                message: "user created",
                                status: 200
                            })
                        } else {
                            console.log(err);
                            res.status(500).send({
                                message: "user create error, " + err
                            })
                        }
                    });
                })

            } else if (err) {
                res.status(500).send({
                    message: "db error"
                })
            } else {
                res.send({
                    message: "User already exist ",
                    status: 409
                })
            }
        })

})




//LOGIN

api.post("/login", (req, res, next) => {

    if (!req.body.email || !req.body.password) {

        res.status(403).send(`
                please send email and password in json body.
                e.g:
                {
                    "email": "malikasinger@gmail.com",
                    "password": "abc",
                }`)
        return;
    }

    userModel.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            res.status(500).send({
                message: "an error Occured: " + JSON.stringify(err)
            });
        } else if (user) {

            bcrypt.varifyHash(req.body.password, user.password).then(isMatched => {
                if (isMatched) {
                    console.log("matched");

                    var token =
                        jwt.sign({
                            id: user._id,
                            name: user.name,
                            email: user.email,
                        }, SERVER_SECRET)

                    res.cookie('jToken', token, {
                        maxAge: 86_400_000,
                        httpOnly: true
                    });

                    res.send({
                        message: "login success",
                        user: {
                            name: user.name,
                            email: user.email,
                            // phone: user.phone,
                            // gender: user.gender,
                        }
                    });

                } else {
                    console.log("Password not matched");
                    res.status(401).send({
                        message: "incorrect password"
                    })
                }
            }).catch(e => {
                console.log("errorhello: ", e)
            })

        } else {
            res.status(403).send({
                message: "user not found"
            });
        }
    });

})

module.exports = api;