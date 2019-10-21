//schedule.js
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
class Schedule extends EventEmitter{
    constructor(){
        super();
    }
    getSchedule(date){
        var self = this;
        var dateArr = [];
        dateArr.push(date);
        var scheduleArray = [];
        //index = 0 hteam.teamID
        // ["homeid enemyid scoreh scorev " ]
        var url = 'http://data.nba.net/data/10s/prod/v1/2018/schedule.json';
        request.get(url, function (error, response, body){
            var json = JSON.parse(body);
            for (var i = 0; i<json.league.standard.length; i++){
                if(dateArr.includes(json.league.standard[i].startDateEastern)){
                    scheduleArray.push(json.league.standard[i].hTeam.teamId + ',' + json.league.standard[i].vTeam.teamId + ',' + json.league.standard[i].startTimeEastern);
                }
            }
            self.emit( 'arrPlayers' , scheduleArray);
        });
    }
    getScheduleformatted(arr){ //arr sent is in this format [[hteamID, vteamID, time] ,[hteamID, vteamID, time], [hteamID, vteamID, time]] for the specific day
        var self= this;
        var hTeam = '';
        var vTeam = '';
        var url = "http://data.nba.net/data/10s/prod/v1/2018/teams.json";
        var scheduleTable = '';
        scheduleTable += '<h1>Schedule</h1>' + table + tr + th + "Home Team vs Away Team" + the + th + "Time" + the + tre;
        request.get(url, function(error, response, body){
            var json = JSON.parse(body);
            for(var p = 0; p < arr.length; p++){
                var element = arr[p].split(',');
                var hTeamId = element[0];
                var vTeamId = element[1];
                var time = element[2];
                for (var i = 0; i<json.league.standard.length; i++){
                    if (json.league.standard[i].teamId == hTeamId){
                        hTeam = json.league.standard[i].fullName;
                    }
                    if (json.league.standard[i].teamId == vTeamId){
                        vTeam = json.league.standard[i].fullName;
                    }
                }
                scheduleTable += tr + th + hTeam + " VS " + vTeam + the + th + time + the + tre;
            }
            scheduleTable+= tablee;
            self.emit('htmlSchedule', scheduleTable);
        });
    }
}
exports.Schedule = Schedule;
