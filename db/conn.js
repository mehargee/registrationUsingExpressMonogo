const mongoose = require("mongoose");

mongoose.connect("mongodb://0.0.0.0:27017/registrationForm")
.then(() =>{
    console.log("server is active")
}).catch((error) =>{
    console.log("no connection",error)
})