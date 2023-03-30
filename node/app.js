var express                 = require('express');
var app                     = express();
var mongoose                = require('mongoose');
var bodyParser              = require('body-parser');
var config                  = require('./config.json');

mongoose.connect(config.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then( function() 
    { 
        console.log(`Mongo Db Connect to ${config.mongoUri}`);

        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({ extended: false }))

        app.listen(config.server_port,
            () => {
                console.log(`Занят на сервере ${config.server_port} порт...`);
            }
        );
    })
    .catch(err => console.error(`Error connection to mogoDB: ${config.mongoUrl}`, err));