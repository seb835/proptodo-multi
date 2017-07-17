## Propeller To-Do (multi-user)

*This project requires a Node.js server running*

This app has a secret hidden menu if you press the Propeller Studios logo. This lets
you configure where your Node.js server lives, and will be remebered.

The Node.js server requires just two files:

### package.json

```json
{
  "name": "proptodo-auth",
  "version": "0.1.0",
  "description": "A sample Node.js app using Express 4",
  "engines": {
    "node": "5.9.1"
  },
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "body-parser": "^1.15.2",
    "cors": "^2.8.0",
    "del": "2.2.0",
    "express": "^4.14.0",
    "http": "0.0.0",
    "method-override": "^2.3.6",
    "morgan": "^1.7.0",
    "superlogin": "^0.6.1"
  }
}
```

### server.js

```javascript
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');
var SuperLogin = require('superlogin');

var app = express();
app.set('port',process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin","*");
  res.header('Access-Control-Allow-Methods','DELETE, PUT');
  res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var config = {
  dbServer: {
    protocol: 'http://',
    host: 'localhost:5984',
    user: '',
    password: '',
    userDB: 'sl-users',
    couchAuthDB: '_users'
  },
  mailer: {
    fromEmail: 'gmail.user@gmail.com',
    options: {
      service: 'Gmail',
      auth: {
        user: 'gmail.user@gmail.com',
        pass: 'userpass'
      }
    }
  },
  security: {
    maxFailedLogins: 3,
    lockoutTime: 600,
    tokenLife: 86400,
    loginOnRegistration: true
  },
  userDBs: {
    defaultDBs: {
      private: ['supertest']
    }
  },
  providers: {
    local: true
  }
}

// Initialize SuperLogin
var superlogin = new SuperLogin(config);

// Mount SuperLogin's routes to our app
app.use('/auth',superlogin.router);

app.listen(app.get('port'));
console.log("App listening on "+app.get('port'));
```

The Node.js server must then be run using:

```bash
node server.js
```
