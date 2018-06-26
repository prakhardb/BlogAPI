var bodyParser = require("body-parser"),
mongoose       = require("mongoose"),
express        = require("express"),
cors           = require("cors"),
app            = express();

//APP CONFIG
mongoose.connect("mongodb://prakhar:blog124@ds117681.mlab.com:17681/pdblog");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: 957729347895-ab040bkfrf5arb54bngfld06bivmjts3.apps.googleusercontent.com,
    clientSecret: 1rE9X7zRxTL0yMVuTwlIgFUM,
    callbackURL: "http://www.example.com/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));


//Model for Post
var postSchema = new mongoose.Schema({
    title: String,
    content: String,
    created : {
        type : Date,
        default: Date.now
    }
});
var Post = mongoose.model("Post", postSchema);

// Post.create({
//     title: "Test Blog",
//     content: "Welcome to my blogs"
// });

//RestFul Routes
app.get("/", function(req, res){
    res.redirect("/posts");
});

//Create Posts
app.post("/posts", function(req,res){
    //Create Post
    Post.create(req.body, function(err,newPost){
        if(err){
            res.send("err");
            res.redirect("/");
        }
        res.send(newPost);
    })
});
//Show Post
app.get("/posts/:id", function(req,res){
      Post.findById(req.params.id, function(err, foundPost){
          if(err){
              res.redirect("/posts");
          } else {
              res.send(foundPost);
          }
      });
});

//Edit Post

//Delete Post
app.delete("/posts/:id", function(req,res){
    //destroy post
    console.log(req.params.id);
    Post.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/posts");
        } else {
            res.redirect("/posts");
        }
    });
});

//Posts page
app.get("/posts", function(req,res){
    Post.find({}, function(err,posts){
        if(err){
            console.log("Error!");
        } else {
            res.send(posts);
        }
    });
});


const PORT = 3001
app.listen(PORT, err => {
  if (err) {
    console.error(err)
  } else {
    console.log(`Running on port ${PORT}`)
  }
})
