const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(cookieParser());

app.get("/",(req,res)=>{
    //setting cookie
    res.cookie("name","Ashwin");
    res.send("done");
});

app.get("/read",(req,res)=>{
    //reading cookie
    res.send(req.cookies)
})
//encription password
app.get("/password",(req,res)=>{
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash("432344555566",salt,(err,hash)=>{
            res.send(hash);
        })
    })
})

//compare (no decrypt)
app.get("/compare",(req,res)=>{
    bcrypt.compare("432344555566","$2b$10$X7lKqntzD42VNUraoBH6N.pwL4JImQl/Kn2BEE6544tJcJOtJgEeS",(err,isMatch)=>{
        if(isMatch){
            res.send("match");
        }else{
            res.send("not match");
        }
    })
})

app.get("/setEmail",(req,res)=>{
    let token = jwt.sign({email:"ashwin.ce@gmail.com"},"secret");
    res.cookie("token",token);
    res.redirect("/");
})

app.get("/readtoken",(req,res)=>{
    let token = req.cookies.token;
    res.send(token);
    let data = jwt.verify(token,"secret");
    console.log(data);
})

app.listen(3000);