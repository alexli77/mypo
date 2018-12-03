var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_lihua',
  password        : '4779',
  database        : 'cs340_lihua'
});

module.exports.pool = pool;