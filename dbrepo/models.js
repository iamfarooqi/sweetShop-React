var mongoose = require("mongoose");

let dbURI = "mongodb+srv://iamfarooqi:03325312621@cluster0.8tr9b.mongodb.net/TestDataBase?retryWrites=true&w=majority";
mongoose.connect(dbURI, {useNewUrlParser: true,useUnifiedTopology: true});



mongoose.connection.on('connected', function () {
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});

var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    // profilePic: String,
    // phone: String,
    // gender: String,
    createdOn: {
        type: Date,
        'default': Date.now
    }
});
var userModel = mongoose.model("users", userSchema);

module.exports = {
    userModel: userModel
   
}