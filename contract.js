module.exports = function(){

    var express = require('express');
    var router = express.Router();

    function getContracts (res, mysql, context, done){
        var sql_query = "   SELECT c.id, c.total ,c.length, c.yearly, (a.fname) as athlete FROM endorse_contract c\
                            INNER JOIN endorse_athlete a ON a.athlete_id = c.aid ";
        mysql.pool.query(sql_query, function(err, result, fields){
            if(err){
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.contract = result;
            done();
        });
    }


    // get athlete
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
    
    
     router.get('/', function(req, res){

        var callbackCount = 0;
        var context = {};
         context.jsscripts = ["deletecontract.js"];

        var mysql = req.app.get('mysql');

        getAthletes(res, mysql, context, complete);
        getContracts(res, mysql, context, complete);
      

        function complete() {
            callbackCount++;
            if (callbackCount >= 2) {

                //console.log(context);

                res.render('contract', context);
            }
        }
    });
    
    
    //get one contract

    function getcontract(res, mysql, context, contract_id, complete) {
        var sql = "SELECT c.id, c.total ,c.length, c.yearly, (a.fname) as athlete FROM endorse_contract c\
                            INNER JOIN endorse_athlete a ON a.athlete_id = c.aid WHERE contract_id = ?";
        var inserts = [contract_id];
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

 router.get('/:contract_id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatecontract.js"];
        var mysql = req.app.get('mysql');

        getAthletes(res, mysql, context, complete);
        getContracts(res, mysql, context, complete);

        function done(){
            callbackCount++;
            if(callbackCount >= 2){

                console.log(context.order);
                res.render('update-contract', context);
            }
        }
    });


    
    //add contracts
    
     router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO endorse_contract (total, length, yearly,aid) VALUES ( ?,?, ?, ?);";

        var inserts = [req.body.total, req.body.lemgth, req.body.yearly, req.body.aid];

        sql = mysql.pool.query(sql, inserts, function(err, results, fields){
            if(err){
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }else{

                res.redirect('/contract');
            }
        });
    });

     // UPDATE contract
    router.put('/:contract_id', function(req, res){
        console.log(req.body);

        var mysql = req.app.get('mysql');
        var sql = "UPDATE endorse_contract SET total=?, length=?, yearly=?,aid=? WHERE contract_id=?";
        var inserts = [req.body.total, req.body.lemgth, req.body.year, req.body.aid];

        sql = mysql.pool.query(sql, inserts, function(err, result, fields){
            if(err){
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }else{
                console.log("Contract UPDATED");
                res.status(200);
                res.end();
            }
        });
    });

    router.delete('/:coid', function(req, res){

        console.log("DELETE ROUTE HIT");

        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM endorse_contract WHERE contract_id = ?";
        var inserts = req.params.coid;

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