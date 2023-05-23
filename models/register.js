const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const employeeSchema = new mongoose.Schema({
    fristname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    }
})

// midleWare use for password hash method bcryptjs //ye data get or save k drmyan me chaly ga
employeeSchema.pre("save", async function (next) {
        //jb b password create kry ya update kry tbhi ye bcrypt kry ga.
    if (this.isModified("password")) {
        console.log(`simple passowrd --- ${this.password}`)
        this.password = await bcrypt.hash(this.password, 10)
        console.log(`after hash passowrd --- ${this.password}`)
        
        // confirm password field show nai hogi DB me.
        this.confirmpassword = undefined;
    }
    next();
})

// model of schema
const Register = new mongoose.model("Register", employeeSchema);

module.exports = Register;