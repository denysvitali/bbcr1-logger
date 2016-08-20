'use strict';

var fs = require('fs');
var request = require('request');

var BBCR1_SONGURL = 'http://polling.bbc.co.uk/radio/realtime/bbc_radio_one.json';
var outfile = 'songlist.json';
var lastSong = '';

function loop() {
    var end = () => {
        setTimeout(() => {
            loop();
        }, 15000);
    };
    request(BBCR1_SONGURL, (err, res, body) => {
        if (!err) {
            var json = JSON.parse(body);
            if (json.realtime.record_id !== lastSong) {
                console.log(json.realtime.artist + ' - ' + json.realtime.title);
                lastSong = json.realtime.record_id;
                addSongToList(json.realtime);
            }
            //console.log(json);
        }
        end();
    });
}

function addSongToList(song) {
    var json = {
        songs: []
    };
    try {
        var file = fs.readFileSync(__dirname + '/' + outfile);
        json = JSON.parse(file);
    } catch (e) {
        console.log('Unable to parse file!');
        console.log(e);
    }
    json.songs.push({
        'artist': song.artist,
        'title': song.title,
        'start': song.start,
        'end': song.end,
        'record_id': song.record_id
    });
    fs.writeFileSync(__dirname + '/' + outfile, JSON.stringify(json));
}

loop();
