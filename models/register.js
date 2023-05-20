const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    fristname : {
        type: String,
        required: true
    },
    lastname : {
        type: String,
        required: true
    },
    mobile : {
        type: Number,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    age : {
        type: Number,
        required: true
    },
    gender : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    confirmpassword : {
        type: String,
        required: true
    }
})

const Register = new mongoose.model("Register", employeeSchema);

module.exports = Register;