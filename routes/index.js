/*
* @Author: caijw
* @Date:   2017-10-28 19:18:17
* @Last Modified by:   caijw
* @Last Modified time: 2017-11-05 14:27:12
*/
const passport = require("passport")
const router = require("express").Router()
const db = require("../db")
var moment = require('moment')
var base64 = require('base-64');
var utf8 = require('utf8');
//判断是否登录
function loginRequired(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect("/login")
  }
  next()
}
router
  .get("/index", loginRequired, (req, res, next) => {
  		var uid = req.session.passport.user;
  		db("message")
	      .where("uid", req.user.uid)
        .orderBy('time', 'desc')
        .limit(30)
	      .then((users) => {
          if(!users){
            return res.render("404")
          }

          for (var i=0; i<users.length; i++) {
            var bytes = utf8.encode(users[i].mid.toString());
            users[i].baseMid = base64.encode(bytes);
          }
          console.log(users);
	        res.render("index", {
	          users: users
	        })
	      })
   })
  .get("/deleteMessage/:id", loginRequired, (req, res, next) => {
    const query = db("message").where("mid", req.params.id)
    query
      .delete()
      .then((result) => {
        if (result === 0) {
          return res.send("没有删除成功")
        }
        db("response").where("mid", req.params.id).delete().then((result)=>{
          if (result === 0) {
            return res.send("没有删除成功")
          }
        })
        res.redirect("/index")
      })
  })
  .get("/editMessage/:id", loginRequired, (req, res, next) => {
    var bytes = base64.decode(req.params.id);
    var mid = utf8.decode(bytes);
    const query = db("message").where("mid", mid)
    query
      .first()
      .then((result) => {
        //判断是否有这个
        if(!result){
          return res.render("404")
        }
         res.render("edit", {
            mid: result.mid,
            message : result.message
         })
      })
  })
  .post("/editMessage", loginRequired, (req, res, next) => {
    const { mid } = req.body;
    db('message')
      .where('mid', mid)
      .update(req.body)
      .then((result) => {
        if(result === 0){
          return res.send(400)
        }
        res.redirect("/index");
      }, next)
  })
  .get("/addMessage", loginRequired, (req, res, next) => {
    res.render("add");
  })
  .post("/addMessage", loginRequired, (req, res, next) => {
    req.body.uid = req.session.passport.user;
    req.body.time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    db('message')
      .insert(req.body)
      .then((message) =>{
        res.redirect("/index");
      }, next)
  })
  .get("/detail/:id", (req, res, next) => {
    var bytes = base64.decode(req.params.id);
    var mid = utf8.decode(bytes);
    const query = db("message").where("mid", mid)
    query.first().then((result) => {
        //判断是否有这个
        if(!result){
          return res.render("404")
        }
        var uid = result.uid;
        db("user").where("uid", uid).first().then((users) => {
            res.render("detail",{
              message : result.message,
              time :  moment(result.time).format('YYYY-MM-DD HH:mm'),
              name : users.username,
              mid : result.mid
            });
        })
    })
  })
  //删除错误接龙信息
  .get("/manageResponse/:id", loginRequired, (req, res, next) => {
      var bytes = base64.decode(req.params.id);
      var mid = utf8.decode(bytes);
       const query = db("response").where("mid", mid).orderBy('num', 'asc')
      .then((responses)=>{
        if(!responses){
            return res.send(400);
          }
          //时间处理
          if(responses.length>0){
            for(var i=0; i<responses.length; i++){
              responses[i].time = moment(responses[i].time).format('YY-MM-DD')
            }
          }else{
            responses.length = 0;
          }
          res.render('manage',{
            length : responses.length,
            responses : responses,
            mid : mid
          });
      },next)
    })
    .post("/deleteResponse", loginRequired, (req, res, next) => {
      var mid = req.body.mid;
      const query = db("response").where("rid", req.body.rid)
      query
        .delete()
        .then((result) => {
          if (result === 0) {
            return res.send("没有删除成功")
          }
          res.send(200)
        })
    })
module.exports = router