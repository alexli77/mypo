const express = require('express');
const mysql = require('./dbcon.js');
const bodyParser  = require('body-parser');
const path = require('path');
const handleBars = require('express-handlebars').create({ 
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts')
});

// EXPRESS server config
var app = express();

app.set('port', process.argv[2]);

app.set('mysql', mysql);
app.use(bodyParser.urlencoded({extended:true}));

app.use('/static', express.static('public'));

// handlebars config
app.engine('handlebars', handleBars.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, "views"));

app.use('/athlete', require('./athlete.js'));
app.use('/brand', require('./brand.js'));
app.use('/contract', require('./contract.js'));
app.use('/country', require('./country.js'));
app.use('/sport', require('./sport.js'));


app.get('/', function(req, res){
    res.render('index');
});

app.use(function(req, res) {
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

