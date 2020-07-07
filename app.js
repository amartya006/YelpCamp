var express= require("express");
var app = express();
var bodyParser = require("body-parser");

var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var flash = require("connect-flash");
var Campground = require("./models/yelpcampModel");
var Comment = require("./models/commentModel");
var User = require("./models/userModel")
var seedDB = require("./seed");
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index")

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost/yelp_camp");

app.set("view engine", "ejs");
app.use(express.static("Assets"))
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"))
app.use(flash());

//PASSPORT Configuration

app.use(require("express-session")({
    secret:"Amartya Nigam",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Accessing Variable

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error   = req.flash("error");
    next();
});


//seedDB();

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);




app.listen(3000, function(){
    console.log("YelpCamp Server has Started on Port 3000");
})