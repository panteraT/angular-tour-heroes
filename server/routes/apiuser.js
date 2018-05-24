const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const LocalStorage= require('node-localstorage').LocalStorage;
const jwt = require('jsonwebtoken');


localStorage = new LocalStorage('./screatch');

// Connect
const connection = (closure) => {
    return MongoClient.connect('mongodb://admin:1111@ds213759.mlab.com:13759/heroes', (err, db) => {
        if (err) return console.log(err);

        closure(db);
    });
};

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// Get all users
router.get('/users', (req, res) => {
    console.log('get request!');
    connection((db) => {
        db.collection('userInfo')
            .find()
            .toArray(function(err,docs){
                if(err){
                    console.log(err);
                   return res.sendStatus(500);
                }
                res.send(docs);
            })
    });
});

//get user for login
router.get('/users/:login/:password',(req,res) => {
    console.log( 'request get for login and password!');
    connection((db) =>{ 
        db.collection('userInfo')
            .findOne({$and:[{login: req.params.login},{password:req.params.password}]}, function(err,doc){
                if (err){
                    console.log(err);
                    return res.sendStatus(500);
                }
                
                if (doc){
                    var thisTime = Date.now();
                    var token = jwt.sign(req.params.login,thisTime.toString());  
                    var tokenObj = {
                            token: token,
                            userLogin: req.params.login,
                            timeLifeToken: thisTime +1800000     // (1800000 ms)
                    }
                    localStorage.setItem("token"+req.params.login,JSON.stringify(tokenObj)); 
                
                    console.log ("token"+req.params.login+": "+ localStorage.getItem("token"+req.params.login));
                    
                }
                else {
                    console.log("This user wasn't found!");
                    return res.status(502).send("This user wasn't found!");
                }
                res.send(doc);
        });
    });
    
});

router.post('/users', function(req, res){
    
    var user = {
        login: req.body.login,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        email: req.body.email
    };
    connection((db) =>{ db.collection('userInfo').findOne({login: req.body.login},function (err,result){
        if (err){
            console.log(err);
            return res.sendStatus(500);
        }
        if (result){
            console.log("Was found user "+ result.login +" Server Error! This user already exists!");
            return res.status(501).send("This user already exists!");
        }
        else {
            console.log( 'Put new user!');
            connection((db) =>{ 
                db.collection('userInfo').insert(user, function(err,result){
                    if (err){
                        console.log(err);
                        return res.sendStatus(500);
                    }
                    res.sendStatus(200);
                })
            });
            var thisTime = Date.now();
            var token = jwt.sign(user.login,thisTime.toString());  
            var tokenObj = {
                token: token,
                userLogin: user.login,
                timeLifeToken: thisTime +1800000     //(1800000 ms)
            }
            localStorage.setItem("token"+user.login,JSON.stringify(tokenObj)); 

            console.log ("token"+user.login+": "+ localStorage.getItem("token"+user.login));
        }
        
    })})
});

router.get('/token/:login', (req, res) => {
    console.log('get token by login!');

    var tokenObj = JSON.parse(localStorage.getItem('token'+ req.params.login));
    res.send(tokenObj);
});

router.put('/token/:login', (req, res) => {
    console.log('update token by login!');
    var thisTime = Date.now();
    var token = jwt.sign(req.params.login,thisTime.toString());  
    var tokenObj = {
        token: token,
        userLogin: req.params.login,
        timeLifeToken: thisTime +1800000     // (1800000 ms)
    }
    localStorage.setItem('token'+ req.params.login);
    res.send(tokenObj);
});

router.delete('/users/:id', (req, res) => {
    console.log( 'request delete for id!');
    connection((db) =>{ 
    db.collection('userInfo').deleteOne(
        {_id: ObjectID(req.params.id)},
        function(err,result){
            if (err){
                console.log(err);
                return res.sendStatus(500);       
            }
            res.sendStatus(200);
        })
    })
    
});

module.exports = router;