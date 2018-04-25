const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

// Connect     mongodb://localhost:27017/heroesCollection
// mongodb://admin:1111@ds213759.mlab.com:13759/heroes

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

// Get heroes
router.get('/heroes', (req, res) => {
    console.log('get request!');
    connection((db) => {
        db.collection('heroesCollection')
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

router.get('/heroes/search/:value',(req,res) => {
    console.log( 'request search for ' + req.params.value);
    connection((db) =>{
        db.collection('heroesCollection')
            .find({$or: [ {name: {$regex: req.params.value, $options: 'i'}},
                          {color: {$regex: req.params.value, $options: 'i'}},
                          {type: {$regex: req.params.value, $options: 'i'}},
                          {scope: {$eq: parseInt(req.params.value)}}]})
            .toArray( function(err,doc){
                if (err){
                    console.log(err);
                    return res.sendStatus(500);
                }
            res.send(doc)
        })
    });
 });

router.get('/heroes/:id',(req,res) => {
    console.log( 'request get for id!');
    connection((db) =>{ 
        db.collection('heroesCollection')
            .findOne({_id: ObjectID(req.params.id)}, function(err,doc){
                if (err){
                    console.log(err);
                    return res.sendStatus(500);
                }
            res.send(doc)
        });
    });
});

router.get('/heroes/:name',(req,res) => {
    console.log( 'request get for name!');
    connection((db) =>{ 
        db.collection('heroesCollection')
            .findOne({name: req.params.name}, function(err,doc){
                if (err){
                    console.log(err);
                    return res.sendStatus(500);
                }
            res.send(doc)
        });
    });
});


router.post('/heroes', function(req, res){
    var options =  {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: 'numeric',
        minute: 'numeric',
        
      };
    var hero = {
        name: req.body.name, 
        color: req.body.color, 
        scope: req.body.scope,
        date: new Date().toLocaleString("en-US",options),
        type: req.body.type
    };
    console.log( 'request put new hero!' );
    connection((db) =>{ 
        db.collection('heroesCollection').insert(hero, function(err,result){
            if (err){
                console.log(err);
                return res.sendStatus(500);
            }
            res.send(hero);
        })
    })
})

router.put('/heroes/:id', function(req, res){
    console.log('update hero!');
    connection((db) => {
        db.collection('heroesCollection').update(
            {_id: ObjectID(req.params.id)},
            {name: req.body.name,
            color: req.body.color,
            scope: req.body.scope,
            date: req.body.date,
            type: req.body.type},
            function (err,result){
                if (err){
                    console.log(err);
                    return res.sendStatus(500);
                }
            res.sendStatus(200);
        }
    )
})
})

router.delete('/heroes/:id', (req, res) => {
    console.log( 'request delete for id!');
    connection((db) =>{ 
    db.collection('heroesCollection').deleteOne(
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