/*
* @Author: caijw
* @Date:   2017-10-28 18:37:38
* @Last Modified by:   caijw
* @Last Modified time: 2017-10-29 13:09:28
*/
const passport = require("passport")
const router = require("express").Router()

router
  .get("/login", (req, res, next) => {
    res.render("login")
  })
  .post("/login", passport.authenticate("local-login1", {
    successRedirect: "/index",
    failureRedirect: "/login",
    failureFlash: true
  }))
  .get("/logout", (req, res, next) => {
    req.session.destroy((err) => {
      res.redirect("/login")
    })
  })
  .get("/signup", (req, res, next) => {
    res.render("signup")
  })
  .post("/signup",  passport.authenticate("local-register", {
    successRedirect: "/index",
    failureRedirect: "/signup",
    badRequestMessage: '请填写内容',
    failureFlash: true
  }))
module.exports = router