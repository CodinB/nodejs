var express = require("express");
var app = express();


/************************************************************************ */
/****** Server Configuration */
/************************************************************************ */

//render HTML from the endpoints
var ejs = require('ejs');
app.set('views', __dirname + "/public");
app.engine('html', ejs.renderFile);
app.set('view engine',ejs);

//server static file (js, css, img, pdf)
app.use(express.static(__dirname + '/public'));



//configure body-parser to read request payload
var bparser = require('body-parser');
app.use(bparser.json());

// DB connection to Mongo DB
var mongoose = require('mongoose');
mongoose.connect("mongodb://ThiIsAPassword:TheRealPassword@cluster0-shard-00-00-euadh.mongodb.net:27017,cluster0-shard-00-01-euadh.mongodb.net:27017,cluster0-shard-00-02-euadh.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin");
var mongoDB = mongoose.connection;
var itemDB; //variable declaration, it is the DB objeect constructor

/************************************************************************ */
/*** Server HTML */
/************************************************************************ */
app.get('/', function(req, res){
    res.render('index.html');
})

app.get('/about', function(req,res){
    // res.send('<h1 style="color:red;">Briun Greene</h1>')
    res.render('about.html')
})

//create the /admin endpoint
//server the admin.html

app.get('/admin',function(req,res){
    res.render('admin.html')
})

app.get('/contact', function(req,res){
    res.send('<h1 style="color:red;">briun.greene@gmail.com</h1>')
})

/************************************************************************ */
/***  API Endpoints  */
/************************************************************************ */
var list = [];

app.post('/API/items', function(req,res){
    // console.log("Browser created a POST request");
    var item = req.body;
    //will change storage from list array to mongoDB

    //create the DB object
    var itemForDB = itemDB(item);

    //save the obj on the DB
    itemForDB.save(function(error, savedObject){ // parameters are always error, and success

        if(error){
            // something went wrong
            console.log("Error saving the item:" + error);
            res.status(500);//Internal Server Error, set status code so dont get 200 OK code
            res.send(error); // = return
        }

        //no error
        res.status(201); // 201 = created, ok
        res.json(savedObject)

    });

    // save the obj on the db
    // list.push(item);

    // res.json(item);
});

app.get('/API/items', function(req,res){
    // res.json(list);
    itemDB.find({}, function(error,data){ //parameters are empty filter for all data, and callback function
        if(error){
            res.status(500);
            res.send(error);
        }

        res.json(data)
    })
})

//listening for an error event in DB
mongoDB.on('error',function(error){
    console.log("Error connection to DB:" + error);
})
//listening for successful connection event in DB
mongoDB.on('open',function(){
    console.log("Yay DB connection succeed!")

    //predefined schema for items table (collection)
    var itemSchema = mongoose.Schema({
        code: String,
        title: String,
        price: Number,
        description: String,
        category: String,
        image: String,
        user: String
    });

    itemDB = mongoose.model("catalogCh9", itemSchema); //name of table, structure of table
})

/**Start Project */
app.listen(8080,function(){
    console.log("Server running at localhost:8080")
})

//Ctrl + C : kill the server

//put is update, patch is 

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
//  https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
//https://www.restapitutorial.com/httpstatuscodes.html

//terminal command: nodemon server.js, ctrl + c to stop server connection for editing
// API - Application Programming Interface