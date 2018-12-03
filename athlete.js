module.exports = function(){

    var express = require('express');
    var router = express.Router();

    function getAthletes(res, mysql, context, done){
        var sql_query = "SELECT A.athlete_id, A.fname, A.lname, A.gender, C.name AS country, S.name AS Sname, B.name AS brand FROM endorse_athlete A INNER JOIN endorse_country C ON C.country_id = A.cid INNER JOIN endorse_sport S ON S.sport_id = A.sid INNER JOIN endorse_brand B ON B.brand_id = A.bid ";
        mysql.pool.query(sql_query, function(err, result, fields){
            if(err){
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.athlete = result;
            // console.log(context.athlete);
            done();
        });
    }
                            
    
    
     // get others
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
        function getBrands(res, mysql, context, done){
        var sql_query = "SELECT brand_id AS bid, name,ceo,foundyear FROM endorse_brand";
        mysql.pool.query(sql_query, function(err, result, fields){
            if(err){
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.brand = result;
            done();
        });
    }
    
     router.get('/', function(req, res){

        var callbackCount = 0;
        var context = {};
         context.jsscripts = ["deleteathlete.js"];

        var mysql = req.app.get('mysql');

        getAthletes(res, mysql, context, complete);
        getSports(res, mysql, context, complete);
        getCountrys(res, mysql, context, complete);
        getBrands(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 4) {

                //console.log(context);

                res.render('athlete', context);
            }
        }
    });
    
    
    //get one contract

    function getathlete(res, mysql, context, athlete_id, complete) {
        var sql = "SELECT A.athlete_id, A.fname, A.lname, A.gender, C.name AS country, S.name AS sport, B.name AS brand FROM endorse_athlete A INNER JOIN endorse_country C ON C.country_id = A.cid INNER JOIN endorse_sport S ON S.sport_id = A.sid INNER JOIN endorse_brand B ON B.brand_id = A.bid WHERE contract_id = ?";
        var inserts = [athlete_id];
        mysql.pool.query(sql, inserts, function(err, results, fields) {
            if (err) {
                res.write(JSON.stringify(err));
                res.end();
            }
            context.contract = results[0];
            complete();
        });
    }

    // Route to Update contract

 router.get('/:athlete_id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateathlete.js"];
        var mysql = req.app.get('mysql');

        getAthletes(res, mysql, context, complete);
        getSports(res, mysql, context, complete);
        getCountrys(res, mysql, context, complete);
        getBrands(res, mysql, context, complete);

        function done(){
            callbackCount++;
            if(callbackCount >= 4){

                console.log(context.athlete);
                res.render('update-athlete', context);
            }
        }
    });


    
    //add contracts
    
     router.post('/', function(req, res){
        var callbackCount = 0;
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO endorse_athlete (fname, lname, gender, sid, cid,bid) VALUES ( ?,?, ?,?,?, ?);";

        var inserts = [req.body.fname, req.body.lame, req.body.gender, req.body.sid, req.body.cid, req.body.bid];

        sql = mysql.pool.query(sql, inserts, function(err, results, fields){
            if(err){
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }else{

                res.redirect('/athlete');
            }
        });
    });

     // UPDATE contract
    router.put('/:athlete_id', function(req, res){
        console.log(req.body);

        var mysql = req.app.get('mysql');
        var sql = "UPDATE endorse_athlete SET fname=?, lname=?, gender=?,sid=? ,cid=?,bid=? WHERE athlete_id=?";
        var inserts = [req.body.fname, req.body.lame, req.body.gender, req.body.sid, req.body.cid, req.body.bid,req.body.athlete_id];

        sql = mysql.pool.query(sql, inserts, function(err, result, fields){
            if(err){
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }else{
                console.log("Althete UPDATED");
                res.status(200);
                res.end();
            }
        });
    });

    router.delete('/:athlete_id', function(req, res){

        console.log("DELETE ROUTE HIT");

        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM endorse_athlete WHERE athlete_id = ?";
        var inserts = req.params.athlete_id;

        sql = mysql.pool.query(sql, inserts, function(err, results, fields){
            if(err){
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }else{
                res.status(202);
                res.end();
            }
        });
    });
    
    

    return router;
}();