'use strict';
const http = require('http');
const request = require('request');
const playerModule = require('./players');
const scheduleModule = require('./schedule');
const PORT = 8080;
const express = require('express');
const app = express();
app.use(express.static('.'));

const p = new playerModule.Players();
const s = new scheduleModule.Schedule();

const todayDate = new Date().toISOString().slice(0,10).replace('-','').replace('-', '');

// mysql connection, it will not work remotely
var mysql = require('mysql');
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'bryan1998',
    database: 'players'
});
con.connect(function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log('mysql connected!');
    }
});

app.post('/roster', function(req, res) {
    console.log('server running for /roster');
    p.once('arrPlayers', function(msg1){
        p.once('htmlPlayer', function(msg2){
            res.send(msg2);
            res.end();
        });
        p.getPlayerName(msg1);
    });
    p.getPlayerArr();
});

app.post('/schedule', function(req, res) {
    console.log('server running for /schedule');
    s.once('arrPlayers', function(msg1){
        s.once('htmlSchedule', function(msg2){
            res.send(msg2);
            res.end();
        });
        s.getScheduleformatted(msg1);
    });
    s.getSchedule(todayDate);
});

app.get('/searchPositions', function(req,res){
    var positionString = '';
    var position = req.query.pos;
    con.query('Select pos, name from positions where pos=\'' + position+'\';', function(err,rows,fields){
        if(err){
            console.log("Error getting query from database");
            console.log(err);
        }
        else{
            for(var i = 0; i< rows.length; i++){
                positionString+= rows[i].name + ' (' + rows[i].pos + ")<br>";
            }
            res.send(positionString);
        }
    });
})

app.get('*', function(req, res) {
    res.redirect('./index.html');
});

// port set up
app.listen(PORT, function() {
    console.log('Server running on port ' + PORT);
});
