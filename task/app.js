const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const path = require('path');
const userModel = require("./models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.render("index");
});

app.post("/create", (req,res)=>{
    let {username,email,password,age} = req.body;

    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt, async (err,hash)=>{
            if(err) console.log(err);
            else{
            const createdUser = await userModel.create({
                username,
                email,
                password:hash,
                age
            });
            let token = jwt.sign({email},"shhhhhhhhhhhhhh");
            res.cookie("token",token);
            res.send(createdUser);
        }
        })
    })


})

app.get("/login",(req,res)=>{
    res.render("login");
})

app.get("/logout",(req,res)=>{
    res.cookie("token","");
    res.redirect("/");
})

app.post("/loggedIn",async(req,res)=>{
    let user = await userModel.findOne({email:req.body.email});
    if(!user) return res.status(400).send("Something Went Wrong");

    bcrypt.compare(req.body.password,user.password,(err,result)=>{
        if(result){
            let token = jwt.sign({email:user.email},"shhhhhhhhhhhhhh");
            res.cookie("token",token);
            res.send("Your Cookie Was Created");
        }
        else
        {
            res.send("Password Wrong");
        }

    })
})

app.listen(3000);