/*
* @Author: caijw
* @Date:   2017-10-23 21:46:50
* @Last Modified by:   caijw
* @Last Modified time: 2017-11-05 15:22:11
*/
'use strict';
const express = require("express")
const bodyParser = require("body-parser")
const session = require("express-session")
const passport = require("passport")
var flash = require('connect-flash')
const authRoutes = require("./routes/auth")
const indexRoutes = require("./routes/index")
const myRoutes = require("./routes/my")
const responseRoutes = require("./routes/response")
const db = require("./db")
require("./passport")

const app = express();
const staticAssets = __dirname + '/public';
//const faviconPath = __dirname + '/public/favicon.ico';

app
  .set("view engine", "hjs")
  .use(express.static(staticAssets))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({extended: false}))
  .use(session({ secret: "i love dogs", cookie: {maxAge: 365*24*60*60*1000 }, resave: false, saveUninitialized: false }))
  .use(passport.initialize())
  .use(passport.session())
  .use(flash())
  .use(function(req, res, next){
    res.locals.message = req.flash('error');
    next();
  })
  .use(authRoutes)
  .use(indexRoutes)
  .use(myRoutes)
  .use(responseRoutes)
  .get("/", (req, res, next) => {
    res.send({
      session: req.session,
      user: req.user,
      authenticated: req.isAuthenticated()
    })
  })
  .listen(80)
console.log('listen 80');