module.exports = function(){

    var express = require('express');
    var router = express.Router();

    function getSports(res, mysql, context, done){
        var sql_query = "SELECT sport_id AS sid, name FROM endorse_sport";
        mysql.pool.query(sql_query, function(err, result, fields){
            if(err){
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.sport = result;
            // console.log(context.sport);
            done();
        });
    }

    function getSport(res, mysql, context, sport_id, complete) {
        var sql = "SELECT sport_id AS sid, name FROM endorse_sport WHERE sport_id = ?";
        var inserts = [sid];
        mysql.pool.query(sql, inserts, function(err, results, fields) {
            if (err) {
                res.write(JSON.stringify(err));
                res.end();
            }
            context.sport = results[0];
            complete();
        });
    }

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO endorse_sport (name) VALUES (?)";
        console.log(req.body);
        var inserts = [req.body.sname_input];
        
        sql = mysql.pool.query(sql, inserts, function(err, result, fields){
            if(err){
                res.write(JSON.stringify(err));
                res.end();
            }else{
                res.redirect('/sport');
            }
        });
    });

    router.get('/', function(req, res){

        var callbackCount = 0;
        var context = {};
        context .jsscripts = ["deletesport.js"];

        var mysql = req.app.get('mysql');

        getSports(res, mysql, context, done);

        function done(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('sport', context);
            }
        }
    });

    router.delete('/sport/:id', function(req, res){

        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM endorse_sport WHERE id = ?";
        var inserts = [req.params.sid];

        sql = mysql.pool.query(sql, inserts, function(err, results, fields){
            if(err){
                res.write(JSON.stringify(err));
                res.status(400);
                res.end();

            }else{
                res.status(202);
                res.end();
            }
        });
    });

    router.get('/:sport_id', function(req, res) {
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatesport.js"];
        var mysql = req.app.get('mysql');
        getSport(res, mysql, context, req.params.sport_id, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1)
            {
                res.render('update-sport', context);
            }
        }
    });

    router.put('/:sport_id', function(req, res) {
        var mysql = req.app.get('mysql');
        var sql = "UPDATE endorse_sport SET name=?  WHERE id=?";
        var inserts = [req.body.first_name, req.body.last_name, req.params.sport_id];
        sql = mysql.pool.query(sql, inserts, function(err, results, fields) {
            if (err) {
                res.write(JSON.stringify(err));
                res.end();
            } else {
                res.status(200);
                res.end();
                console.log("Updated Sport");
            }
        });
    });

    // router.put('/:cid', function(req, res){
    //     var mysql = req.app.get('mysql');
    //     var sql = ""
    // });

    return router;
}();