module.exports = function(){

    var express = require('express');
    var router = express.Router();

    function getCountrys(res, mysql, context, done){
        var sql_query = "SELECT country_id AS cid, name FROM endorse_country";
        mysql.pool.query(sql_query, function(err, result, fields){
            if(err){
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.country = result;
            // console.log(context.country);
            done();
        });
    }

    function getCountry(res, mysql, context, country_id, complete) {
        var sql = "SELECT country_id AS cid, name FROM endorse_country WHERE country_id = ?";
        var inserts = [country_id];
        mysql.pool.query(sql, inserts, function(err, results, fields) {
            if (err) {
                res.write(JSON.stringify(err));
                res.end();
            }
            context.country = results[0];
            complete();
        });
    }

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO endorse_country (name) VALUES (?)";
        console.log(req.body);
        var inserts = [req.body.cname_input];
        
        sql = mysql.pool.query(sql, inserts, function(err, result, fields){
            if(err){
                res.write(JSON.stringify(err));
                res.end();
            }else{
                res.redirect('/country');
            }
        });
    });

    router.get('/', function(req, res){

        var callbackCount = 0;
        var context = {};
        context .jsscripts = ["deletecountry.js"];

        var mysql = req.app.get('mysql');

        getCountrys(res, mysql, context, done);

        function done(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('country', context);
            }
        }
    });

    router.delete('/:country_id', function(req, res){

        console.log("DELETE ROUTE HIT");

        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM endorse_country WHERE country_id = ?";
        var inserts = req.params.cid;

        sql = mysql.pool.query(sql, inserts, function(err, results, fields){
            if(err){
                // NOTE: ** WONT DELETE if country IS ASSOCIATED WITH SALES REP CURRENTLY
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }else{
                res.status(202);
                res.end();
            }
        });
    });

    router.get('/:country_id', function(req, res) {
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatecountry.js"];
        var mysql = req.app.get('mysql');
        getcountry(res, mysql, context, req.params.country_id, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1)
            {
                res.render('update-country', context);
            }
        }
    });

    //The URI that update data is sent to in order to update the country
    router.put('/:country_id', function(req, res) {
        var mysql = req.app.get('mysql');
        var sql = "UPDATE endorse_country SET name=?  WHERE country_id=?";
        var inserts = [req.body.first_name, req.body.last_name, req.params.country_id];
        sql = mysql.pool.query(sql, inserts, function(err, results, fields) {
            if (err) {
                res.write(JSON.stringify(err));
                res.end();
            } else {
                res.status(200);
                res.end();
                console.log("Updated country");
            }
        });
    });

    // router.put('/:cid', function(req, res){
    //     var mysql = req.app.get('mysql');
    //     var sql = ""
    // });

    return router;
}();