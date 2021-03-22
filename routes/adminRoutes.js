var express = require('express')
var bcrypt = require("bcrypt-inzi")
var jwt = require('jsonwebtoken');
var {adminPanel} = require('../dbconn/module')
var router = express.Router();
var SERVER_SECRET = process.env.SECRET || "1234";


router.post("/adminLogin", (req, res, next) => {

    if (!req.body.email || !req.body.password) {

        res.status(403).send(`
            please send email and passwod in json body.
            e.g:
            {
                "email": "farooqi@gmail.com",
                "password": "123",
            }`)
        return;
    }

    adminPanel.findOne({ email: req.body.email },
        function (err, user) {
            console.log("user ====", user)
            if (err) {
                res.status(500).send({
                    message: "an error occured: " + JSON.stringify(err)
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
                            maxAge: 86400000,
                            httpOnly: true
                        });

                        res.send({
                            status: 200,
                            message: "login success",
                            user: {
                                email: user.email,
                            }
                        });
                        

                    } else {
                        console.log("not matched");
                        res.send({
                            message: "Incorrect password or email"
                        })
                    }
                }).catch(e => {
                    console.log("error: ", e)
                })

            } else {
                res.send({
                    message: "user not found"
                });
            }
        });
})
router.post("/logout", (req, res, next) => {
    res.clearCookie('jToken');
    // res.cookie('jToken', "", {
    //     maxAge: 86400000,
    //     httpOnly: true
    // });
    res.send("logout success");
})

module.exports = router;