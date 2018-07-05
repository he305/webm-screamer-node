var express = require('express')
var bodyParser = require('body-parser')
var webmController = require('./wembController')
var db = require('./db')
var down = require('./ffmpeg')
var cors = require('cors')
var app = express()

var port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors())

app.post('/', (req, res) => {
    //res.send('Hello API');
    

});

app.post('/api', webmController.findByMD5);

db.connect(function(err) {
    if (err || process.env.DATABASE_URL) {
        return console.log(err);
    }
    
    var server = app.listen(port, () => {
        console.log("Server started");
    });
    server.setTimeout(300);
});