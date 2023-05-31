require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
require("../db/conn");

const auth = require("./middleware/auth")
const Register = require("../models/register");
const port = process.env.PORT || 3000;

const staticPath = path.join(__dirname, "../public");
const templatesPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
// console.log(path.join(__dirname,"../templates/views"))

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(staticPath));
app.set("view engine", "hbs");
app.set("views", templatesPath);
hbs.registerPartials(partialsPath);


app.get("/", (req, res) => {
    res.render("index");
})

app.get("/secret", auth, (req, res) => {
    //console.log(`this is cookie parser ${req.cookies.jwt}`)
    res.render("secret");
})

app.get("/logout", auth, async (req, res) => {
    try {
            // current user token filter out, logout only current device
        // req.user.tokens = req.user.tokens.filter((curEle) =>{
        //     return curEle.token !== req.token;
        // })

        //logout from the all devices
        req.user.tokens = [];

        res.clearCookie("jwt");
        console.log("logout sucessfully");

        await req.user.save();
        res.render("login");

    } catch (error) {
        res.status(500).send(error)
    }
})

app.get("/home", (req, res) => {
    res.render("home");
})

app.get("/login", (req, res) => {
    res.render("login");
})


app.post("/index", async (req, res) => {
    try {
        const password = req.body.password;
        const conPassword = req.body.conPassword;

        if (password === conPassword) {

            const registerEmployee = new Register({
                fristname: req.body.firstName,     //database key : form key
                lastname: req.body.lastName,
                email: req.body.email,
                age: req.body.age,
                gender: req.body.gender,
                mobile: req.body.mobile,
                password: password,
                confirmpassword: conPassword

            })
// use midelware for generate token
            const token = await registerEmployee.generateAuthToken();

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 30000), //30sec
                httpOnly: true  
            }); 
            

            const regist = await registerEmployee.save();
            console.log("student is registerd sucessfully");
            res.status(200).render("home");

        } else {
            res.send("password are not matching");
        }
    } catch (error) {
        res.status(400).send(error);
        console.log("error is:", error)
    }
})

//login part

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        //is email k filter pe uska sara data useremail me aa gaya hai
        const useremail = await Register.findOne({ email: email })   //database field email: form filed name email
        //  if(useremail.password === password){  

        // we using hash so check or compare password this method 
        const isMatch = await bcrypt.compare(password, useremail.password);
        //create token when user login
        const token = await useremail.generateAuthToken();
        console.log("Token Part are:" + token);

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 600000), //50sec
            httpOnly: true,
            //secure : true
        }); 

        if (isMatch) {
            res.status(201).render("home");
            console.log("login Sucessfully..!")
        } else {
            res.send("invalid login details")
        }

    } catch (error) {
        res.status(400).send("invalid login details")
    }
})


app.listen(port, () => {
    console.log(`server is active on port ${port}`);
})