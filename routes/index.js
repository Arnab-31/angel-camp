var express = require("express");
var router = express.Router();
var passport = require("passport");
var User =require("../models/user");

router.get("/",function(req,res)
{
    res.render("landing");
})





//AUTH ROUTES

router.get("/register",function(req,res)
{
    res.render("register");
})

router.post("/register",function(req,res)                            //Module(5) - Express.js
{
    var newUser= new User({username: req.body.username});
    User.register(newUser,req.body.password,function(err,user){      //Module(6) - Mongo DB manipulation        
        if(err)
        {
            req.flash("error", err.message);
            return res.render("register")
        }
        passport.authenticate("local")(req,res,function()
        {
            req.flash("success", "Welcome "+newUser.username+"! You have Successfully Signed Up")
            res.redirect("/campgrounds");
        })
    });
});

//show login form
router.get("/login",function(req,res)
{
    res.render("login");
})


router.post("/login",passport.authenticate("local",          //Module(5) - Express.js
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),function(req,res){
})

router.get("/logout",function(req,res)
{
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect("/login")
}

module.exports=router;