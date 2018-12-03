module.exports = function() {
    var express = require('express');
    var router = express.Router();
    var mysql = require("./dbcon.js");

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

    function getBrand(res, mysql, context, brand_id, complete) {
        var sql = "SELECT brand_id AS bid, name,ceo,foundyear FROM endorse_brand WHERE brand_id = ?";
        var inserts = [brand_id];
        mysql.pool.query(sql, inserts, function(err, results, fields) {
            if (err) {
                res.write(JSON.stringify(err));
                res.end();
            }
            context.brand = results[0];
            complete();
        });
    }

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO endorse_brand (name,foundyear,ceo) VALUES (?,?,?)";
        console.log(req.body);
        var inserts = [req.body.name_input, req.body.year_input,req.body.ceo_input];
        
        sql = mysql.pool.query(sql, inserts, function(err, result, fields){
            if(err){
                res.write(JSON.stringify(err));
                res.end();
            }else{
                res.redirect('/brand');
            }
        });
    });

    router.get('/', function(req, res){

        var callbackCount = 0;
        var context = {};
        context .jsscripts = ["deletebrand.js"];

        var mysql = req.app.get('mysql');

        getBrands(res, mysql, context, done);

        function done(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('brand', context);
            }
        }
    });

    router.delete('brand/:brand_id', function(req, res){

        console.log("DELETE ROUTE HIT");

        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM endorse_brand WHERE id = ?";
        var inserts = req.params.bid;

        sql = mysql.pool.query(sql, inserts, function(err, results, fields){
            if(err){
                // NOTE: ** WONT DELETE if brand IS ASSOCIATED WITH SALES REP CURRENTLY
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }else{
                res.status(202);
                res.end();
            }
        });
    });

    router.get('/:brand_id', function(req, res) {
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatebrand.js"];
        var mysql = req.app.get('mysql');
        getBrand(res, mysql, context, req.params.brand_id, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1)
            {
                res.render('update-brand', context);
            }
        }
    });

    //The URI that update data is sent to in order to update the brand
    router.put('/:brand_id', function(req, res) {
        var mysql = req.app.get('mysql');
        var sql = "UPDATE endorse_brand SET name=?,ceo=?,foundyear=? WHERE brand_id=?";
        var inserts = [req.body.first_name, req.body.last_name, req.params.brand_id];
        sql = mysql.pool.query(sql, inserts, function(err, results, fields) {
            if (err) {
                res.write(JSON.stringify(err));
                res.end();
            } else {
                res.status(200);
                res.end();
                console.log("Updated brand");
            }
        });
    });

    // router.put('/:bid', function(req, res){
    //     var mysql = req.app.get('mysql');
    //     var sql = ""
    // });

    return router;
}();