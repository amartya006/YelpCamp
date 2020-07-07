var mongoose = require("mongoose")
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost/cat");

var catSchema = new mongoose.Schema({
    name: String,
    age: Number,
    temperament: String
});

var Cat = mongoose.model("Cat", catSchema);

Cat.create({
    name: "Kitty",
    age:7,
    temperament: "Funny"
},function(err, cat){
    if(err){
        console.log("Oh No!! Its Error");
    }
    else{
        console.log("We Saved a Cat to Database");
        console.log(cat);
    }
})

Cat.find({} ,function(err, cats){
    if(err){
        console.log(err);
    }
    else{
        console.log(cats);
    }
})

