var express = require('express')
var fs = require ('fs')
var mysql = require('mysql');
var bodyParser = require("body-parser");
var app = express()

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "moonfish"
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


con.connect(function(err) {
    if (err) throw err;
    console.log("Connected sql");
});

app.get('/', function (req, res) {

    fs.readFile('index.html', (err, data) => {
        if (err) throw err;
        res.setHeader('Content-type', 'text/html');
        res.send(data);
    });
})

app.get('/form', function (req, res) {

    fs.readFile('form.css', (err, data) => {
        if (err) throw err;
        res.setHeader('Content-type', 'text/css');
        res.send(data);
    });
})

app.get('/test', function (req, res) {
    res.send('Hello BBB')
})

app.post('/post', function (req, res) {
    var name = req.body.name;

    con.query("SELECT * FROM pecheur WHERE nom_pecheur ='"+ name +"'", function (err, resultPecheur) {
        if (err) throw err;
        fs.readFile('index2.html', (err, contentBuffer) => {
            if (err) throw err;
            res.setHeader('Content-type', 'text/html');
            var contentHtml = contentBuffer.toString('utf8');
            console.log("Connected 1");
            contentHtml = contentHtml.replace('{{nom_pecheur}}', resultPecheur[0].nom_pecheur);
            contentHtml = contentHtml.replace('{{prenom_pecheur}}', resultPecheur[0].prenom_pecheur);
            console.log("Connected 2");


            con.query("SELECT idNavire,nom_navire FROM navire", function (err, resultNav){
                if (err) throw err;
                var options = '';

                for(var i = 0; i < resultNav.length;i++){
                    options +="<option value='"+ resultNav[i].idNavire +"'>"+ resultNav[i].nom_navire +"</option>";

                }
                contentHtml = contentHtml.replace('{{options}}', options);
                res.send(contentHtml);
            });

        });

    });
});



app.get('/sql', function (req, res) {
    con.query("SELECT * FROM pecheur", function (err, result, fields) {
        if (err) throw err;
        res.send(result[0].nom_pecheur);
    });
})


app.listen(3000)