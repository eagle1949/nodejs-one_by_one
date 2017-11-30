/*
* @Author: caijw
* @Date:   2017-10-28 18:32:19
* @Last Modified by:   caijw
* @Last Modified time: 2017-11-30 21:25:48
*/
const knex = require("knex")

const db = knex({
  client: "mysql",
  connection: {
    host: "rm-wz93wz47ejc698muk.mysql.rds.aliyuncs.com",
    user: "root",
    database: "one_by_one",
    password : "Mm!123456"
  },
  debug: false
})

module.exports = db;