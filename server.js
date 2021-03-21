var express = require("express");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require("cors");
var morgan = require("morgan");
var { foodUserModel, foodOrderModel, foodOrderModel } = require('./dbconn/module')
var path = require("path")
var SERVER_SECRET = process.env.SECRET || "1234";
var jwt = require('jsonwebtoken')
var app = express()
var authRoutes = require('./routes/auth')
var adminRoutes = require('./routes/adminRoutes')

app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({
    origin: ['http://localhost:3000',"http://localhost:5000"],
    credentials: true
}));
app.use(morgan('dev'));
// app.use("/", express.static(path.resolve(path.join(__dirname, "public")));

app.get('/', (req, res, next) => {
    res.send("running")
    
})

app.use('/', authRoutes);
app.use('/', adminRoutes);
app.use(function (req, res, next) {
    console.log(req.cookies.jToken)
    if (!req.cookies.jToken) {
        res.status(401).send("include http-only credentials with every request")
        return;
    }
    jwt.verify(req.cookies.jToken, SERVER_SECRET, function (err, decodedData) {
        if (!err) {

            const issueDate = decodedData.iat * 1000;
            const nowDate = new Date().getTime();
            const diff = nowDate - issueDate;

            if (diff > 300000) {
                res.status(401).send("token expired")
            } else {
                var token = jwt.sign({
                    id: decodedData.id,
                    name: decodedData.name,
                    email: decodedData.email,
                    
                }, SERVER_SECRET)
                res.cookie('jToken', token, {
                    maxAge: 86400000,
                    httpOnly: true
                });
                req.body.jToken = decodedData
                req.headers.jToken = decodedData
                next();
            }
        } else {
            res.status(401).send("invalid token")
        }
    });
})

app.get("/adminProfile", (req, res, next) => {

    console.log(req.body)

    foodUserModel.findById(req.body.jToken.id, 'name email createdOn',
        function (err, doc) {
            console.log( "doc",doc)
            if (!err) {
                res.send({
                    status: 200,
                    profile: doc
                })

            } else {
                res.status(500).send({
                    message: "server error"
                })
            }
        })
})
app.get("/profile", (req, res, next) => {

    console.log(req.body)

    foodUserModel.findById(req.body.jToken.id, 'name email phone createdOn',
        function (err, doc) {
            console.log( "doc",doc)
            if (!err) {
                res.send({
                    status: 200,
                    profile: doc
                })

            } else {
                res.status(500).send({
                    message: "server error"
                })
            }
        })
})

app.post("/order",(req,res,next)=>{
    console.log("fsfsf",req.body)
    if (!req.body.orders || !req.body.total) {

        res.status(403).send(`
            please send email and passwod in json body.
            e.g:
            {
                "orders": "order",
                "total": "12342",
            }`)
        return;
    }

    foodUserModel.findOne({email: req.body.jToken.email} ,(err,user)=>{
        if (!err) {
            foodOrderModel.create({
                name: user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                total: req.body.total,
                orders:req.body.orders
            }).then((data)=>{
                res.send({
                    status: 200,
                    message: "Order have been submitted",
                    data: data
                })
            }).catch(()=>{
                res.status(500).send({
                    message: "order submit error, " + err
                })
            })
        }
        else{
            console.log(err)
        }
    })
})

app.get('/getOrders',(req,res,next)=>{
    foodOrderModel.find({},(err,data)=>{
        if (!err) {
            res.send({
                data:data
            })
        }
        else{
            res.send(err)
        }
    })
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("server is running on: ", PORT);
})

