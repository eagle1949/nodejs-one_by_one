/*
* @Author: caijw
* @Date:   2017-11-04 23:21:51
* @Last Modified by:   caijw
* @Last Modified time: 2017-11-05 15:27:40
*/
const passport = require("passport")
const router = require("express").Router()
const db = require("../db")
var moment = require('moment')
const bcrypt = require("bcrypt-nodejs")
//判断是否登录
function loginRequired(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect("/login")
  }
  next()
}
router
  .get("/my", loginRequired, (req, res, next) => {
  	  res.render("my")
   })
   .get("/username", loginRequired, (req, res, next) => {
  	  res.render("username",{
  	  	username : req.user.username,
  	  	uid : req.user.uid
  	  })
   })
   //修改发起人
   .post("/changeUsername", loginRequired, (req, res, next) => {
    const { uid } = req.body;
    db('user')
      .where('uid', uid)
      .update(req.body)
      .then((result) => {
        if(result === 0){
          return res.send(400)
        }
        res.redirect("/my");
      }, next)
  })
   .get("/password", loginRequired, (req, res, next) => {
      res.render("password",{
        account : req.user.account
      });
   })
   .post("/changePassword", loginRequired, (req, res, next) => {
      var oldPassword = req.body.oldPassword;
      var password = req.body.password;
      var password2 = req.body.password2;
      if (!bcrypt.compareSync(oldPassword, req.user.password)) {
          res.render("password",{
            message : '原密码错误'
          });
      }
      if (password !== req.body.password2) {
          res.render("password",{
            message : '密码不一致'
          });
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
          res.redirect("/logout");
        }, next)
   })
module.exports = router