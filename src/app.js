const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");

require("../db/conn");
const Register = require("../models/register");

const port = process.env.PORT || 3000;

const staticPath = path.join(__dirname, "../public");
const templatesPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
// console.log(path.join(__dirname,"../templates/views"))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(staticPath));
app.set("view engine", "hbs");
app.set("views", templatesPath);
hbs.registerPartials(partialsPath);


app.get("/", (req, res) => {
    res.render("index");
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

app.get("/login", (req, res) =>{
    res.render("login");
})

app.post("/login", async (req, res) =>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        //is email k filter pe uska sara data useremail me aa gaya hai
        const useremail = await Register.findOne({email:email})   //database field email: form filed name email
            if(useremail.password === password){
                res.status(201).render("home")
            }else{
                res.send("invalid login details")
            }

    } catch (error) {
        res.status(400).send("invalid login details")
    }
})


app.listen(port, () => {
    console.log(`server is active on port ${port}`);
})