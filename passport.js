/*
* @Author: caijw
* @Date:   2017-10-29 12:21:11
* @Last Modified by:   caijw
* @Last Modified time: 2017-11-05 15:22:08
*/
const bcrypt = require("bcrypt-nodejs")
const db = require("./db")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
var moment = require('moment')

passport.use(new LocalStrategy(authenticate));
passport.use("local-register", new LocalStrategy({
        usernameField:'account',
        passwordField:'password',
        passReqToCallback: true
     }, 
     function(req, account, password, done){
        db("user")
        .where("account", req.body.account)
        .first()
        .then((user) => {
          if (user) {
            return done(null, false, req.flash('error', '已经被注册'))
          }
          if (password !== req.body.password2) {
            return done(null, false, req.flash('error', '密码不一致'))
          }
          const newUser = {
            username : req.body.username,
            account: req.body.account,
            password: bcrypt.hashSync(password),
            registorTime : moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
          };
          db("user")
            .insert(newUser)
            .then((uids) => {
              console.log(uids);
              newUser.uid = uids[0]
              done(null, newUser)
            })
        })
     }
))

//登录
passport.use("local-login1", new LocalStrategy({
        usernameField:'account',
        passwordField:'password',
        passReqToCallback: true
     }, 
     function(req, account, password, done){
        db("user")
        .where("account", account)
        .first()
        .then((user) => {
          if (!user || !bcrypt.compareSync(password, user.password)) {
            var message =  "账号或者密码错误";
            return done(null, false, req.flash('error',message))
          }

          done(null, user)
        }, done)
     }
))

//修改密码
passport.use("local-password1", new LocalStrategy({
        usernameField:'account',
        passwordField:'password',
        passReqToCallback: true
     }, 
     function(req, account, password, done){
        var oldPassword = req.body.oldPassword;
        if (!bcrypt.compareSync(oldPassword, req.user.password)) {
            var message =  "原密码错误";
            return done(null, false, req.flash('error',message))
        }
        if (password !== req.body.password2) {
            return done(null, false, req.flash('error', '密码不一致'))
        }
        const newUser = {
            password: bcrypt.hashSync(password)
        };
        db('user')
        .where('uid', req.user.uid)
        .update(newUser)
        .then((user) => {
          if(user === 0){
            return res.send(400)
          }
          return done(null, false, req.flash('error', '修改密码成功'))
        }, done)
     }
))


function authenticate(account, password, done){
  db("user")
    .where("account", account)
    .first()
    .then((user) => {
      if (!user || !bcrypt.compareSync(password, user.password)) {
        var message =  "invalid user and password combination";
        return done(null, false, req.flash('error',message))
      }

      done(null, user)
    }, done)
}


passport.serializeUser(function(user, done) {
  done(null, user.uid)
})

passport.deserializeUser(function(uid, done) {
  db("user")
    .where("uid", uid)
    .first()
    .then((user) => {
      done(null, user)
    }, done)
})
