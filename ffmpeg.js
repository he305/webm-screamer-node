var fs = require('fs');

const ffmpeg = require('fluent-ffmpeg');
const download = require('download');
 
const LOUD = -12.0
const SCREAM = -5.0 
const DEFENITLY_SCREAM = -0.5  


exports.download_video = function (url) {
    return new Promise(function(resolve, reject) {
        var file_name = url.split('/').pop()
        download(url, __dirname)
            .then(data => {
                fs.writeFileSync(__dirname + '/' + file_name, data)

                get_ffmpeg_output(__dirname + '/' + file_name)
                    .then(function(data) {
                        fs.unlinkSync(__dirname + '/' + file_name)
                        resolve(data)
                    })
                    .catch(function(err) {
                        fs.unlinkSync(__dirname + '/' + file_name)
                        reject(err);
                    })
            })
            .catch(function(err) {
                reject(err);
            })
    });
}

function determine_scream_chance(parsed){
	
	if (parsed >= DEFENITLY_SCREAM)
        return 1.0
	else if (parsed >= SCREAM)
		return 0.8
	else if (parsed >= LOUD)
		return 0.5
	else 
        return 0.0
}

function get_ffmpeg_output(filename) {
    return new Promise(function(resolve, reject) {
        var data = ""
        var error = null
        
        ffmpeg(filename)
            .addOption('-f', 'null')
            .addOption('-hide_banner')
            .addOption('-filter_complex', "ebur128=dualmono=true")
            .on('start', function(ffcommand) {
                console.log("ffmpeg for " + filename + " started");
            })
            .on('stderr', function(stderrLine) {
                data += stderrLine + '\n';
            })
            .on('end', function(stdout, stderr) {
                var lines = data.split('\n') 
                
                line_reg = (/\[Parsed_ebur128_\d @ [0-9a-z]{2,16}\]\s+t:\s*([\d.]+)\s+M:\s*([-\d.]+)\s+S:\s*([-\d.]+)\s+I:\s*([-\d.]+) LUFS\s+LRA:\s*([-\d.]+) LU/)
        
                var M = -120.0
                var S = -120.0
                lines.forEach(element => {
                    element = element.trim();
                    match = element.match(line_reg);
                    if (match) {    
                        M = Math.max(M, Number(match[2]))
                        S = Math.max(S, Number(match[3]))
                    }
                });
        
                if (error) {
                    resolve(0.0)
                } 
                resolve(determine_scream_chance(Math.max(M, S)))
            })
            .on('error', function(err, stdout, stderr) {
                console.log('Cannot process video: ' + err.message);
                error = err;

                if (error) {
                    resolve(0.0)
                } 
            })
            .saveToFile('NUL')
    })
}