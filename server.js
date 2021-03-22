var express = require("express");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require("cors");
var morgan = require("morgan");
var { foodUserModel, foodOrderModel, foodProductModel } = require('./dbconn/module')
var path = require("path")
var SERVER_SECRET = process.env.SECRET || "1234";
var jwt = require('jsonwebtoken')
var app = express()
var authRoutes = require('./routes/auth')
const fs = require('fs')
const admin = require("firebase-admin");
const multer = require('multer')

const storage = multer.diskStorage({ 
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, `${new Date().getTime()}-${file.filename}.${file.mimetype.split("/")[1]}`)
    }
})

var upload = multer({ storage: storage })

var SERVICE_ACCOUNT ={
    "type": "service_account",
    "project_id": "sweetshop-14704",
    "private_key_id": "425f3eb58cd3033cb157d731a830a4785ad73203",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCt3Z7ZwQ+KDPet\n1CbWkHfp6YJ5rJyYGEqsYb9lZtXiPzClwJrreS4UoynoEs0njBEN6HHnWpDCtyOg\nrCjTuAGy6O56nwGtBoHy1K2HjrqcEtkBvnh8Iy9RYggLyPAP8+jC0Gpy6noCq7Si\n5libYWFLpDkXnnmirCZ+YGugvD3bAI3eanW2ghv3/8hmCOeNYHlIU0yr8h5Yx5tY\njjsA1cNvaDApUKbfSz1+VAASpJnJp20MKksH1DeLpDd0UhZZw6JKsC6dTL0fWCn3\nlNvhhKDvhA+KBsnNLNlY4tOV5fiSCgwh3b75Pig36BgS4s0aY7Vb1S6zqpXZZ2/d\n3q5idjjRAgMBAAECggEAFjeQIWY8rJjcm29VKSzbzd2jaRXoCr1r6VwyP2xlH1yQ\nxFV41mctPsDczYV9hrSsxzixOW2GuwL5AAKP0wIb4XdHZg7kgW4n89Y+eGiCKwhz\nh3gF4GMEnGMpAQyDtJ4n26ETQSz6O1YipoBFyVEnxCkvjHeZNnLGFncOucLkKpRR\nHz+i8h3wWIZbKmaqmJfTuViHw6Cm1nHSLq2TLrnv04Tcj482XjVWMPC0DygEI1cA\njUcoxYdXhxu3Y9nj9SBdHUEbcidUCQoBRmzKPsSWKp8xmicOQxvPJMtTHbk7acui\nkwxap4ihBaiQteZ41TIMkLd8RCv1em8FA6ww24pE0wKBgQDW26cjvMmiA2jxC1bw\nlQ1o3+l3JJdk0RCm7X08AHWk7N/7ULVLoVQG6IkgNfflvNUn4AWx7AZPs2/DeoZ0\nvdJx+mDQi6mja1yhoRtfMMuoMgLsT7KTrzzVxPqdVn98SWzIN7I5mU1R2KtdHqyL\nacqHCQuepKtPSKmAjt552o1+swKBgQDPKIXms33sMV6Wpau2pRpNlh8ewH2LOv83\nSbUvuB88IfGPXQISCCCfOsbLI/l35Qv83kMS565D1+wcj8n0sfUQSgGMR/7kr2lH\n6nEXNvyXnb9ehWbMyVXwRTFhq1/oshs+e646UOhOk2aJkiAxprpqsGNXLh/zBgzt\nOVoIAAasawKBgEEmGWgctocJwahVZ+dLSuWh/4jA76cCPapgGLk46nM34DK0JkTo\nhjISEIJT2vcuavPMWe25Q7CnGByN6nc7l7Q312Nk9es3gr7/uu0CPr6ha4F8KQne\n+PNY5yUONVnaacHMIZ6VfXxz1oJF6svbKC4J8BwKkmdYAQ2aRJtuSblBAoGAbFDY\n6o6xab1KouRPC3n6bdTvwqmNOy6G4Ya1qRTRqCRrZLWR7pG3VOprpS3TM+BcS0R/\nt7PSB4Ev4KNCSqJ96512f73pRfN9ze+EYEoM+s2tkSOZY7xmJfJX5qSvykDOQ/Zx\nW+aQAP3LYGU6VhvCXySJXL0uUWi5e5RAQeyZkK8CgYEAvwASEWxPA3wGTn4SyYom\nKKr77zJt3HBJaODZccezCeyhFCrC1yoEVHYUODLjV9bZdxJnoJl0IGxQqbW3JX9l\nMDx7SRHI1usERkR/eak5uHoO8GV7DeeXWtNhOn2YhZoytAgmPgkAowo61yZa0cQz\nKbIexUfaJthLS/Z6wj/G+3I=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-veh1n@sweetshop-14704.iam.gserviceaccount.com",
    "client_id": "115780345866392563786",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-veh1n%40sweetshop-14704.iam.gserviceaccount.com"
  }
  

admin.initializeApp({
    credential: admin.credential.cert(SERVICE_ACCOUNT),
    databaseURL: "https://sweetshop-14704-default-rtdb.firebaseio.com/"
});
const bucket = admin.storage().bucket("gs://sweetshop-14704.appspot.com");

app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}));
app.use(morgan('dev'));
app.use("/", express.static(path.resolve(path.join(__dirname, "./web/build"))));

app.use('/', authRoutes);
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
                    role: decodedData.role
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

app.get("/profile", (req, res, next) => {

    console.log(req.body)

    foodUserModel.findById(req.body.jToken.id, 'name email phone role createdOn',
        function (err, doc) {
            console.log("doc", doc)
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
app.post("/addProduct", upload.any(), (req, res, next) => {

    console.log("req.body: ", req.body);
    bucket.upload(
        req.files[0].path,
        function (err, file, apiResponse) {
            if (!err) {
                file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                }).then((urlData, err) => {
                    if (!err) {
                        console.log("public downloadable url: ", urlData[0])
                        foodUserModel.findById(req.headers.jToken.id, 'email role', (err, user) => {
                            console.log("user =======>", user.email)
                            if (!err) {
                                foodProductModel.create({
                                    "name": req.body.productName,
                                    "price": req.body.price,
                                    "stock": req.body.stock,
                                    "image": urlData[0],
                                    "description": req.body.description
                                }).then((data) => {
                                    console.log(data)
                                    res.send({
                                        status: 200,
                                        message: "Product add successfully",
                                        data: data
                                    })
                                }).catch(() => {
                                    console.log(err);
                                    res.status(500).send({
                                        message: "user create error, " + err
                                    })
                                })
                            }
                            else {
                                res.send("err")
                            }
                        })
                        try {
                            fs.unlinkSync(req.files[0].path)
                        } catch (err) {
                            console.error(err)
                        }
                    }
                })
            } else {
                console.log("err: ", err)
                res.status(500).send();
            }
        });
})

app.post("/order", (req, res, next) => {
    console.log("fsfsf", req.body)
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

    foodUserModel.findOne({ email: req.body.jToken.email }, (err, user) => {
        console.log("afafa", user)
        if (!err) {
            foodOrderModel.create({
                name: req.body.name,
                email: user.email,
                phone: req.body.phone,
                status: "In review",
                address: req.body.address,
                total: req.body.total,
                orders: req.body.orders
            }).then((data) => {
                res.send({
                    status: 200,
                    message: "Order have been submitted",
                    data: data
                })
            }).catch(() => {
                res.status(500).send({
                    message: "order submit error, " + err
                })
            })
        }
        else {
            console.log(err)
        }
    })
})

app.get('/getOrders', (req, res, next) => {
    foodOrderModel.find({}, (err, data) => {
        if (!err) {
            res.send({
                data: data
            })
        }
        else {
            res.send(err)
        }
    })
})
app.get('/getProducts', (req, res, next) => {
    foodProductModel.find({}, (err, data) => {
        if (!err) {
            res.send({
                data: data
            })
        }
        else {
            res.send(err)
        }
    })
})
app.get('/myOrders' ,(req,res,next)=>{
    foodUserModel.findOne({email: req.body.jToken.email},(err,user)=>{
        if (user) {
            foodOrderModel.find({email: req.body.jToken.email},(err,data)=>{
                if (data) {
                    res.send({
                        data:data
                    })
                }
                else{
                    res.send(err)
                }
            })
        }else{
            res.send(err)
        }
    })
})

app.post('/updateStatus',(req,res,next)=>{
    foodOrderModel.findById({_id: req.body.id},(err,data)=>{
        if (data) {
            data.updateOne({status: req.body.status},(err,update)=>{
                if (update) {
                    res.send("Status update")
                }
                else{
                    res.send(err)
                }
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