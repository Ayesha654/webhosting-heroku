const express = require("express");
require("./db/conn");
const User = require("./model/user");
const bcrypt = require("bcryptjs");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
//send mail code
// const nodeMailer = require("nodemailer");


// const transport = nodeMailer.createTransport({
//     host: 'SMTPTransport.gmail.com',
//     port: 'localhost:3000',
//     secure: false,
//     requireTLS: true,
//     auth: {
//         user: 'Aisha633156@gmail.com',
//         pass: 'Pakistan!123'
//     }
// })
// //@Aisha?0923473707
// const mailOptions = {
//     from: "Aisha633156@gmail.com",
//     to: "Aisha633156@gmail.com",
//     subject: "sendgrid mail send",
//     text: "testing"
// }
// transport.sendMail(mailOptions, function (error, info) {
//     if (error) {
//         console.log(error);
//     } else {
//         consol.log("email has been sent", info.response);
//     }
// });

const DB = 'mongodb+srv://Ayesha:Ayesha@cluster0.dnrsa.mongodb.net/userSignUP?retryWrites=true&w=majority'
mongoose.connect(DB).then(()=>{
    console.log(`connection to the DB is successful`);
}).catch((error)=>{
    console.log(`connection to the DB is failed`);
})

app.get("/", (req, res) => { return res.send("HOME PAGE") });

app.get("/signup", (req, res) => { return res.send("signup") });

//app.get("/login", (req,res)=>{return res.send("login")});

app.post("/signup", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if (password !== cpassword) {
            return res.status(400).send("passwords not matched");
        }


        const p = await bcrypt.hash(password, 10);
        const signupUser = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            gender: req.body.gender,
            phone: req.body.phone,
            age: req.body.age,
            password: p
        })


        const token = await signupUser.generateAuthToken();
        console.log("token part" + token);

        const signUp = await signupUser.save();
        return res.status(201).send(signUp);

    } catch (error) {
        return res.status(404).send(error);
        console.log(error);
    }
})

//login.
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({ email });


        const token = await User.generateAuthToken();
        console.log("token part" + token);
        
        const p = await bcrypt.hash(password, 10);
        console.log(p,user.password);
        
        if (p === user.password) {
            return res.send("Loged in");
        } else {
            return res.status(201).send("invalid login");
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});


app.listen(port, (req, res) => {
    console.log(`connected to the port number ${port}`);
})