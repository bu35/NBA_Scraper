//players.js
'use strict';
const request = require('request');
const EventEmitter = require('events').EventEmitter;
// for tables
const table = '<table align= \'center\'>';
const tr = '<tr>';
const tre = '</tr>';
const th = '<th>';
const the = '</th>';
const tablee = '</table>';

class Players extends EventEmitter{

    constructor(){
        super();
    }
    getPlayerArr(){
        var self = this;
        request.get('http://data.nba.net/data/10s/prod/v1/' + '2018' + '/teams/sixers/roster.json', function(error, response, body){
            var json = JSON.parse(body);
            var playersIDs = [];
            for (var i = 0; i < (json.league.standard.players).length; i++){
                playersIDs.push(json.league.standard.players[i].personId);
            }
            self.emit('arrPlayers', playersIDs); //array of players and having a [] called playersIDs is super confusing
        });
    }
    getPlayerName(arr){
        var playerNames = [];
        var self = this;
        var url = 'http://data.nba.net/data/10s/prod/v1/2018/players.json';
        request.get(url, function(error, response, body){
            var json = JSON.parse(body);
            for (var i = 0; i < json.league.standard.length ; i++){
                if(arr.includes(json.league.standard[i].personId)){
                    playerNames.push(json.league.standard[i].firstName + ',' + json.league.standard[i].lastName + ',' + json.league.standard[i].jersey + ',' + json.league.standard[i].pos + ',' + json.league.standard[i].heightMeters + ',' + json.league.standard[i].weightKilograms + ',' + json.league.standard[i].dateOfBirthUTC + ',' + json.league.standard[i].country );
                }
            }
            //Below will be making of html String
            //first name
            // last name
            // jersey number
            // postion
            // weight
            // height
            // country
            var playerTable = '';
            playerTable += "<h1>Players</h1>"+ table + tr + th + "First Name" + the + th + "Last Name" + the + th + "Jersey" + the + th + "Pos" + the + th + "Height(M)" + the + th + "Weight(Kg)" + the + th + "DOB" + the + th + "Country" + the+ tre;
            for (var i = 0; i<playerNames.length;i++){
                var x = playerNames[i].split(',');
                playerTable += tr + th + x[0] + the + th + x[1] + the + th + x[2] + the + th + x[3] + the + th + x[4] + the + th + x[5] + the + th + x[6] + the + th + x[7] + the+ tre;
            }
            playerTable += tablee;
            self.emit('htmlPlayer', playerTable);
        });
    }
}
exports.Players = Players;
