var Campground = require("../models/yelpcampModel")
var Comment = require("../models/commentModel")

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    req.flash("error", "You Must be Logged In")
    res.redirect("/login")
}

middlewareObj.checkCommentAuthorisation = function (req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.commId, function(err, commentFound){
            if(err){
                console.log(err)
                res.redirect("back")
            } else{
                if(commentFound.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error", "You are Not Authorised to Do This")
                    res.redirect("back")
                }
            }
        })
    } else{
        req.flash("error", "You Must be Logged in and Authorised to do this.")
        res.redirect("back")
    }
}

middlewareObj.checkAuthorisation = function (req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, campgroundFound){
            if(err){
                console.log(err)
                res.redirect("back")
            } else{
                if(campgroundFound.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error", "You are not Authorised to do this.")
                    res.redirect("back")
                }
            }
        })
    } else{
        req.flash("error", "You Must be Logged in and Authorised to do this.")
        res.redirect("back")
    }
}



module.exports = middlewareObj;
