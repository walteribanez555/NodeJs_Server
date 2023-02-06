var mysql      = require('mysql');
var dotenv = require('dotenv');
const { env } = require('process');


dotenv.config();


var con = mysql.createConnection({
    host: process.env.Db_host,
    user: "root",
    password: process.env.Db_password,
    
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    
    con.query(`Create Database  ${process.env.Db_database}`, function (err, result) {
      if (err) throw err;
      console.log("Database created");
    });
  });