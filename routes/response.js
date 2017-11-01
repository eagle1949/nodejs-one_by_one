/*
* @Author: caijw
* @Date:   2017-10-29 15:42:51
* @Last Modified by:   caijw
* @Last Modified time: 2017-10-30 20:14:57
*/
const router = require("express").Router()
const db = require("../db")
var moment = require('moment')

router
  .get("/response/:id", (req, res, next) => {
  		const query = db("response").where("mid", req.params.id).orderBy('num', 'asc')
  		.then((responses)=>{
  			if(!responses){
  	  			return res.send(400);
  	  		}
  	  		//时间处理
  	  		if(responses.length>0){
  	  			for(var i=0; i<responses.length; i++){
  	  				responses[i].time = moment(responses[i].time).format('YYYY-MM-DD HH:mm')
  	  			}
  	  		}
  	  		var data = {
  	  			length : responses.length,
  	  			responseData : responses
  	  		}
  	  		res.send(data)
  		},next)
   })
   .post("/addResponse", (req, res, next) => {
      req.body.remark = '';
      req.body.time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      db('response')
      .insert(req.body)
      .then((responseIds) =>{
        res.send(responseIds)
      }, next)
   })
module.exports = router