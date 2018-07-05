var Webm = require('./webm');
var video = require('./ffmpeg');

exports.findByMD5 = function(req, res) {
    console.log(req.body.url)
    Webm.findByMD5(req.body.md5)
    .then(function(doc) {
        if (doc) {
            return res.json({"md5": doc.md5, "scream_chance" : doc.screamer_chance});
        } 
        video.download_video("https://2ch.hk" + req.body.url)
        .then(function(screamer_chance) {
            Webm.insert(req.body.md5, screamer_chance)
            .then(result => {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "X-Requested-With");
                return res.json({"md5" : req.body.md5, "scream_chance" : screamer_chance});
            })
            .catch(function(err) {
                console.log("Failed to insert to database")
                return res.status(400).json({"error" : err});
            })
        })
        .catch(function(err) {
            return res.status(400).json({"error" : err});
        })
    })
    .catch(function(err) {
        console.log(err);
        return res.sendStatus(500);
    })



        // if (err) {
        //     console.log(err);
        //     return res.sendStatus(500);
        // }
        // if (doc) {
        //     return res.json({"md5": doc.md5, "scream_chance" : doc.screamer_chance});
        // } 
        // video.download_video("https://2ch.hk" + req.body.url, function(error, screamer_chance) {
        //     if (error) {
        //         return res.status(400).json({"error" : error});
        //     }
        //     Webm.insert(req.body.md5, screamer_chance, (err, result) => {
        //         if (err) {
        //             console.log("Failed to insert to database")
        //             return res.status(400).json({"error" : error});
        //         }
        //         res.header("Access-Control-Allow-Origin", "*");
        //         res.header("Access-Control-Allow-Headers", "X-Requested-With");
        //         return res.json({"md5" : req.body.md5, "scream_chance" : screamer_chance});
        //     })
        // })
        

}