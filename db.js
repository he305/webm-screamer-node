var MongoClient = require('mongodb').MongoClient;
var connectionString = process.env.DATABASE_URL

var state = {
    db: null
};

exports.connect = function (done) {
    if (state.db) {
        return done();
    }
    
    MongoClient.connect(connectionString, (err, client) => {
        if (err) {
            return done(err);
        }
        console.log("db connected")
        
        state.db = client.db('webms_db');
        done();
    });
}

exports.get = function() {
    return state.db;
}

