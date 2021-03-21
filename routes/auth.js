var express = require('express')
var bcrypt = require("bcrypt-inzi")
var jwt = require('jsonwebtoken');
var { foodUserModel, foodOtpModel, } = require('../dbconn/module')
var router = express.Router();
var SERVER_SECRET = process.env.SECRET || "1234";
var postmark = require("postmark");
var emailApi = process.env.EMAIL_API || "c1085f89-3538-4e2d-8751-faf7125765e6"; 
var client = new postmark.ServerClient(emailApi);

router.post("/signup", (req, res, next) => {
    console.log(req.body)
    if (!req.body.name ||
        !req.body.email ||
        !req.body.password ||
        !req.body.phone) {

        res.status(403).send(`
            please send name, email, passwod, phone and gender in json body.
            e.g:
            {
                "name": "jahanzaib",
                "email": "jahanzaib@gmail.com",
                "password": "123",
                "phone": "034320492",
                "gender": "Male"
            }`)
        return;
    }

    foodUserModel.findOne({ email: req.body.email },
        function (err, doc) {
            if (!err && !doc) {

                bcrypt.stringToHash(req.body.password).then(function (hash) {

                    var newUser = new foodUserModel({
                        "name": req.body.name,
                        "email": req.body.email,
                        "password": hash,
                        "phone": req.body.phone,
                    })
                    newUser.save((err, data) => {
                        if (!err) {
                            res.send({
                                status: 200,
                                message: "Signup Successfully"
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
                    message: "user already exist"
                })
            }
        })

})
router.post("/login", (req, res, next) => {

    if (!req.body.email || !req.body.password) {

        res.status(403).send(`
            please send email and passwod in json body.
            e.g:
            {
                "email": "jahanzaib@gmail.com",
                "password": "123",
            }`)
        return;
    }

    foodUserModel.findOne({ email: req.body.email },
        function (err, user) {
            if (err) {
                res.status(500).send({
                    message: "an error occured: " + JSON.stringify(err)
                });
            } else if (user) {
                bcrypt.varifyHash(req.body.password, user.password).then(isMatched => {
                    if (isMatched) {
                        console.log("matched", user );

                        var token =
                            jwt.sign({
                                id: user._id,
                                name: user.name,
                                email: user.email,
                                role: user.role
                            }, SERVER_SECRET)

                        res.cookie('jToken', token, {
                            maxAge: 86400000,
                            httpOnly: true
                        });

                        res.send({
                            status: 200,
                            message: "login success",
                            user: {
                                name: user.name,
                                email: user.email,
                                phone: user.phone,
                                gender: user.gender,
                                role: user.role
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
    res.cookie('jToken', "", {
        maxAge: 86400000,
        httpOnly: true
    });
    res.send("logout success");
})

router.post('/forget-password', (req, res, next) => {
    if (!req.body.email) {
        res.status(403).send({
            message: "please pprovide email"
        })
    }
    foodUserModel.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            res.status(500).send({
                message: "Something went wrong"
            })
        } else if (user) {
            const otp = Math.floor(generetOtp(111111, 999999))
            foodOtpModel.create({
                email: req.body.email,
                otp: otp
            }).then((data) => {
                client.sendEmail({
                    "From": "jahanzaib_student@sysborg.com",
                    "To": req.body.email,
                    "Subject": "Reset Your Password",
                    "Textbody": `Here is your Reset password code : ${otp}`
                }, (err, status) => {
                    if (status) {
                        res.send({
                            status: 200,
                            message: "Email send successfully please enter otp code"
                        })
                    } else {
                        res.send({
                            message: "An unexpected error occured"
                        })
                    }
                })
            })
        } else {
            res.send({
                message: "User not found"
            })
        }
    })
})
router.post('/forget-password-2', (req, res, next) => {
    if (!req.body.newPassword && !req.body.otp) {
        res.status(403).send({
            message: "please pprovide email"
        })
    }

    foodUserModel.findOne({ email: req.body.userData.email }, (err, user) => {
        if (err) {
            res.status(500).send({
                message: "Something went wrong"
            })
        } else if (user) {
            foodOtpModel.find({ email: req.body.userData.email }, (err, otpData) => {
                if (err) {
                    res.status(500).send({
                        message: "Something went wrong"
                    })
                } else if (otpData) {
                    console.log(otpData)
                    otpData = otpData[otpData.length - 1]
                    const nowDate = new Date().getTime();
                    const otpIat = new Date(otpData.createdOn).getTime();
                    const diff = nowDate - otpIat;
                    if (otpData.otp == req.body.otp && diff < 300000) {
                        otpData.remove();
                        bcrypt.stringToHash(req.body.newPassword).then(function (hash) {
                            user.update({ password: hash }, {}, function (err, data) {
                                res.send({
                                    status: 200,
                                    message: "Password updated"
                                });
                            })
                        })
                    } else {
                        res.send({
                            message: "incorrect otp"
                        });
                    }
                } else {
                    res.send({
                        message: "incorrect otp"
                    });
                }
            })
        } else {
            res.send({
                message: "User Not Found"
            })
        }
    })
})
function generetOtp(min, max) {
    return Math.random() * (max - min) + min;
}
module.exports = router;