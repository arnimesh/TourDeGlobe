if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
// require('dotenv').config();

const express =require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate');
const session=require('express-session');
const flash=require('connect-flash');

const methodOverride = require('method-override');
const expressError=require('./utils/expressError');

const userRoutes = require('./routes/users');
const destinations = require('./routes/destination');
const reviews = require('./routes/review');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const Destination=require('./models/destination');

const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const dbUrl='mongodb://localhost:27017/tourdeglobe';

const MongoDBStore = require("connect-mongo")(session);
var moment = require('moment'); // require
moment().format(); 
// 'mongodb://localhost:27017/tour49'
mongoose.connect(dbUrl, { useNewUrlParser: true,useCreateIndex: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO DATABASE CONNECTED!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })
 

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));

app.use(mongoSanitize({
    replaceWith: '_'
}))

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./config/keys');

const store = new MongoDBStore({
    url: dbUrl,
    secret:'jjk',
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store:store,
    name:'seson',
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// passport.serializeUser((user, done) => {
//     done(null, user.id); //user.id is the id from Mongo
// });

// passport.deserializeUser((id, done) => {
//     User.findById(id)
//         .then(user => {done(null, user)
//          .catch((err) => done('pass'));
//         });
// });

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
      done(null, user);
    });
  });
app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// passport.use(
//     new GoogleStrategy({
//         clientID: keys.google.clientID,
//         clientSecret: keys.google.clientSecret,
//         callbackURL: "/callback",
       

  
//     }, (accessToken, refreshToken, profile, done) => {
//         console.log(profile);
//         // passport callback function
//         //check if user already exists in our db with the given profile ID
//         User.findOne({googleId: profile.id}).then((currentUser)=>{
//           if(currentUser){
//             //if we already have a record with the given profile ID
//             done(null, currentUser);
//           } else{
//                //if not, create a new user 
//               new User({
//               googleId: profile.id,
              
                
//               }).save().then((newUser) =>{
//                 done(null, newUser);
//               });
//            } 
//         })
//       })
//   );
// app.get("/auth/google",passport.authenticate("google", {
//    //scope: ['https://www.googleapis.com/auth/plus.login'] ,

//     scope: ["profile", "email"],
//   }));
//   app.get('/callback', 
//   passport.authenticate('google', { failureRedirect: '/destination/login' }),
//   function(req, res) {
//       console.log(req.user);
//       //console.log(profile);
    
//     //   console.log(req.user.emails[0].value);
//     //   console.log(req.user.photos[0].value);
      

      
//     res.redirect('/destination');
//   });



passport.deserializeUser((obj, done) => {
    Admin.deserializeUser();  
});

   


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://fontawesome.com/kits",
    "https://use.fontawesome.com/",
    "https://fontawesome.com/",


];
//This is the array that needs added to
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://stackpath.bootstrapcdn.com/",

    


    
    
];

const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [
    "https://cdnjs.cloudflare.com/",
 "https://use.fontawesome.com/"


];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/ducqvbmtm/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "https://i.imgur.com/",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
app.use('/', userRoutes);
app.use('/destination',destinations)
app.use('/destination',reviews)

app.get('/',(req,res)=>{
    res.render('home');
})

console.log("dsd");
// console.log(currentUser);
 

  app.all('*',(req,res,next)=>{
      next(new expressError('page not found',404))
  })

  app.use((err,req,res,next)=>{
      const {statusCode=500}=err;
   if(!err.message)err.message='Something went Wrong';
    res.status(statusCode).render('error.ejs',{err});
  })
app.listen(3000,()=>{
    console.log('Listening on port 3000')
})


// dbUrl=mongodb+srv://ronaldo:u7dB93HgbZDJIbvI@tourdeglobe.dp7nb.mongodb.net/tourdeglobe?retryWrites=true&w=majority