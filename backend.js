var express=require('express');
var mongoose = require('mongoose');
var passport = require("passport");
var bodyParser = require("body-parser");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
const Admin = require("./admin");
const ejs = require('ejs');
const app=express();
app.set('view engine','ejs');
// for home.html(get)

app.get('/home',(req,res)=>{
    res.sendFile(__dirname+'/home.html')
})

//for admin login.html(get)

app.get('/login',(req,res)=>{
    res.sendFile(__dirname+'/login.html')
})

//for register.html(get)

app.get('/register',(req,res)=>{
    res.sendFile(__dirname+'/register.html')
})

//for admin_signup(get)

app.get('/admin_signup',(req,res)=>{
    res.sendFile(__dirname+'/admin_register.html')
})



//mongoDb atlas url
const uri ="mongodb+srv://2311cs010480:hms123@hms.kjnbk0p.mongodb.net/?retryWrites=true&w=majority&appName=HMS"

//creating database and connecting mongoose.

mongoose.connect(uri,{dbName:'HMS'})

.then(()=>{
    console.log('Connected to MongoDB');
})
.catch(err=>{
    console.log('error connecting to Atlas',err.message);
})

// express related

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
    secret: "a",
    resave: false,
    saveUninitialized: false
}));
 
app.use(passport.initialize());
app.use(passport.session());
 
passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());


//defining schema for users

const userSchema=new mongoose.Schema({
    f_name:String,
    l_name:String,
    mnumber:String,
    email:String,
    father_name:String,
    gender:String,
    birthdate:Date,
    address:String,
    room_no:String,
    fee:String
})

//for users in Db
const User = mongoose.model('User',userSchema)

//post for register(users)
app.post('/submit',async(req,res)=>{
    const {f_name,l_name,mnumber,email,father_name,gender,birthdate,address,room_no,fee}=req.body;
    try{
        const newUser=new User({f_name,l_name,mnumber,email,father_name,gender,birthdate,address,room_no,fee})
        await newUser.save()
        res.send('Data saved sucessfully')
        //res.json(post)
    }catch(err){
        res.status(500).send('Error saving data')
    }
})

//get for room_m(find)

app.get('/room_m',async(req,res)=>{
  try{
    const user = await User.find();
    res.render('room_m',{ user });
  } catch(err){
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

//get for fee(find)

app.get('/fee_m',async(req,res)=>{
  try{
    const user = await User.find();
    res.render('fee_m',{ user });
  } catch(err){
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

//for stu_m(find)

app.get('/stu_m',async(req,res)=>{
  try{
    const user = await User.find();
    res.render('stu_m',{ user });
  } catch(err){
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


//admin signup
app.post("/admin_signup", async (req, res) => {
    const admin = await Admin.create({
      username: req.body.username,
      password: req.body.password
    });
   
    return res.sendFile(__dirname+'/login.html');
  });


// handling admin login form 
app.post("/login", async function(req, res){
    try {
        // check if the user exists
        const admin = await Admin.findOne({ username: req.body.username });
        if (admin) {
          //check if password matches
          const result = req.body.password === admin.password;
          if (result) {
            res.sendFile(__dirname+'/home2.html');
          } else {
            res.status(400).json({ error: "password doesn't match" });
          }
        } else {
          res.status(400).json({ error: "User doesn't exist" });
        }
      } catch (error) {
        res.status(400).json({ error });
      }
});






// listening port

const port =3001
app.listen(port,()=>{
    console.log(`Server is Running on port number ${port}`)
})