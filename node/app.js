var express                 = require('express');
var app                     = express();
var mongoose                = require('mongoose');
var cors                    = require('cors');

var AdminBro                = require('admin-bro');
var expressAdminBro         = require('@admin-bro/express');
var mongooseAdminBro        = require('@admin-bro/mongoose');

var models                  = require('./models');
var config                  = require('./config.json');

var User                    = mongoose.model('User');
var Live                    = mongoose.model('Live');


AdminBro.registerAdapter(mongooseAdminBro);


var adminBro                = new AdminBro({resources: [User, Live]});
var router                  = expressAdminBro.buildAuthenticatedRouter(adminBro, {
    authenticate: async (email, password) => {
        if(
            email == "admin" &&
            password == "admin_admin"
        )
        {
            return true;
        }
        else
        {
            return false;
        };
    },
    cookiePassword: 'some-secret-password-used-to-secure-cookie',
});


mongoose.connect(config.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then( function() 
    { 
        console.log(`Mongo Db Connect to ${config.mongoUrl}`);

        app.use(express.json());
        app.use(cors());
        app.use(adminBro.options.rootPath, router);

        app.post('/server.io', function(req, res) 
        {
            ActionRouter(req.body, res);
        });

        app.listen(config.server_port,
            () => {
                console.log(`Занят на сервере ${config.server_port} порт...`);
            }
        );
    })
    .catch(err => console.error(`Error connection to mogoDB: ${config.mongoUrl}`, err));


async function ActionRouter(data, res)
{
    try {
        var ActionRouters = {
            'registration': registration,
            'index': index,
            'auth': auth,
        };
    
        if(typeof ActionRouters[data['type']] != 'undefined')
        {
            ActionRouters[data['type']](data, res);
        };
    } catch(err) {
        console.log(err);
    };
};

async function index(data, res)
{
    try {
        var _User   = await User.findOne({_id: data['token']});
        var _Games  = await Live.find({});

        res.json({
            status: 'success',
            data: {
                'Games': _Games,
                'User': _User,
            },
        });
    } 
    catch(err) {
        res.json({
            status: 'error',
            type: 'unknown',
            data: 'Ошибка!',
        });
    }
};

async function auth(data, res) 
{
    if(
        typeof data['login'] != 'undefined' &&
        typeof data['password'] != 'undefined' &&

        data['login'].length > 0 &&
        data['password'].length >= 6
    )
    {
        if(
            (await User.find({login: data.login})).length != 0
        )
        {
            var _User = await User.findOne({
                login: data.login,
                password: data.password,
            });

            if(_User)
            {
                res.json({
                    status: 'success',
                    token: _User._id,
                });
            }
            else
            {
                res.json({
                    status: 'error',
                    type: 'user_data',
                    data: 'Такого пользователя не сущетсвует!',
                });
            }; 
        }
        else
        {
            res.json({
                status: 'error',
                type: 'user_data',
                data: 'Такого пользователя не сущетсвует!',
            });
        };
    }
    else
    {
        res.json({
            status: 'error',
            type: 'data',
            data: 'Данные введены не верно!',
        });
    };
};

async function registration(data, res)
{
    if(
        typeof data['login'] != 'undefined' &&
        typeof data['password'] != 'undefined' &&

        data['login'].length > 0 &&
        data['password'].length >= 6
    )
    {
        if(
            (await User.find({login: data.login})).length == 0
        )
        {
            try {
                var _User = await User.create({
                    login: data.login,
                    password: data.password,
                });

                res.json({
                    status: 'success',
                    token: _User._id,
                });
            } 
            catch (err) {
                res.json({
                    status: 'error',
                    type: 'user_create',
                    data: 'Ошибка создания пользователя!',
                });
            };
        }
        else
        {
            res.json({
                status: 'error',
                type: 'user_data',
                data: 'Такой пользователь существует!',
            });
        };
    }
    else
    {
        res.json({
            status: 'error',
            type: 'data',
            data: 'Данные введены не верно!',
        });
    };
};


