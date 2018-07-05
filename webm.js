var db = require('./db');

exports.findByMD5 = function(md5) {
    return new Promise(function(resolve, reject) {
        db.get().collection('webms').findOne({md5: md5}, function(err, doc) {
            if (err) {
                reject(err)
            }
            resolve(doc);
        });
    })
}

exports.insert = function(md5, screamer_chance) {
    return new Promise(function(resolve, reject) {
        db.get().collection('webms').insert({md5: md5, screamer_chance: screamer_chance}, function(err, result) {
            if (err) {
                reject(err);
            }
            console.log("Data inserted: " + md5 + " " + screamer_chance);
            resolve(result);
        });
    });
}