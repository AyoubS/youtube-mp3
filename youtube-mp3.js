var utils = require('./utils.js'),
    request = require('request'),
    fs = require('fs');

var baseUrl = 'http://www.youtube-mp3.org';
var video_id = process.argv[2],
    video_id = ExtractVideoId(video_id) || process.argv[2];
var itemInfo = "/a/itemInfo/?video_id=" + video_id + "&ac=www&t=grp&r=" + (new Date).getTime(),
    itemInfo = sig_url(itemInfo);

request(baseUrl + itemInfo, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var info = body.substring(0, body.length - 1).substring(7),
            info = JSON.parse(info);

        console.log('[*] Processing: ' + info.title);

        setTimeout(function() {
            DownloadAudio(info);
        }, 5000);
    }
});

function DownloadAudio(info) {
  var video = "/get?video_id=" + video_id + "&ts_create=" + info.ts_create + "&r=" + encodeURIComponent(info.r) + "&h2=" + info.h2,
      video = sig_url(video),
      path = './' + info.title + '.mp3';

  console.log('[*] Downloading ...');

  request({uri: baseUrl + video})
      .pipe(fs.createWriteStream(path))
      .on('close', function() {
        console.log('[*] Successfully saved audio file to ' + path);
      });
}
