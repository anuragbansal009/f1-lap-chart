var fs = require('fs');
var path = require('path');
var async = require('async');
var _ = require('underscore');
var ErgastData = require('./ergastData');
var ErgastToChartConverter = require('./ergastToChartConverter');

var ergastData = new ErgastData();
var ergastToChartConverter = new ErgastToChartConverter();

function Data(config) {
    this.updateSeasons = updateSeasons;
    this.updateAllRaceResults = updateAllRaceResults;
    this.updateRaceResultsFromSeason = updateRaceResultsFromSeason;
    this.updateRaceResult = updateRaceResult;

    function updateSeasons(callback) {
        ergastData.getRacesWithData(function(err, seasons) {
            if (err) {
                callback(err);
            }
            else {
                fs.writeFile(config.seasonsInfoPath, toPrettyJson(seasons), function (err) {
                    err ? callback(err) : callback(null);
                });
            }
            flag();
        });
    }

    // seasons.json needs to be updated
    function updateAllRaceResults(callback) {
        var seasonsInfo = JSON.parse(fs.readFileSync(config.seasonsInfoPath, 'utf8'));
        var sortedSeasonsInfo = _.sortBy(seasonsInfo, function(season) { return season.year; });
        var startYear = sortedSeasonsInfo[0].year;
        var endYear = sortedSeasonsInfo[sortedSeasonsInfo.length - 1].year;

        var year = startYear;
        async.whilst(
            function () { return year <= endYear },
            function (callback) {
                updateRaceResultsFromSeason(year, function(err) {
                    ++year;
                    callback(err);
                });
            },
            function (err) {
                callback(err);
            }
        );
    }

    // seasons.json needs to be updated
    function updateRaceResultsFromSeason(season, callback) {
        var seasonsInfo = JSON.parse(fs.readFileSync(config.seasonsInfoPath, 'utf8'));
        var seasonInfo = _.find(seasonsInfo, function(seasonInfo) { return seasonInfo.year == season });

        var round = 1;
        async.whilst(
            function () { return round <= seasonInfo.rounds.length },
            function (callback) {
                updateRaceResult(season, round, function() {
                    ++round;
                    // We need to avoid making too many consecutive calls to Ergast
                    setTimeout(function() { callback(null); }, 5000);
                });
            },
            function (err) {
                callback(err);
            }
        );
    }

    function updateRaceResult(season, round, callback) {
        async.waterfall([
            function(callback){
                getDataFromErgast(season, round, callback);
            },
            function(raceResults, laps, pitStops, drivers, callback) {
                convertDataFromErgastToChartFormat(raceResults, laps, pitStops, drivers, callback);
            }
        ], function (err, raceResultForChart) {
            if (err) {
                callback(err);
            }
            else {
                fs.writeFile(raceResultsPath(season, round), toPrettyJson(raceResultForChart), function (err) {
                    err ? callback(err) : callback(null);
                });
            }
        });
    }

    function getDataFromErgast(season, round, callback) {
        ergastData.getData(season, round, function(err, raceResults, laps, pitStops, drivers) {
            err ? callback(err) : callback(null, raceResults, laps, pitStops, drivers);
        });
    }

    function convertDataFromErgastToChartFormat(raceResults, laps, pitStops, drivers, callback) {
        ergastToChartConverter.getChartDataFromErgastInfo(raceResults, laps, pitStops, drivers,
            function(err, chartData) {
                err ? callback(err) : callback(null, chartData);
            });
    }

    function raceResultsPath(season, round) {
        return config.raceResultsPath + season + "_" + round + ".json";
    }

    function toPrettyJson(json) {
        return JSON.stringify(json, null, 4);
    }

    function flag() {
        const fs = require("fs");
        fs.readFile("..\\frontend\\data\\seasons.json", (err, parsedata) => {
            if (err) throw err;
            //    console.log(data.toString());
            let data = JSON.parse(parsedata);
            for (var i = 0; i < data.length; i++) {
                //    console.log(data[i].rounds.toString());
                for (var j = 0; j < data[i].rounds.length; j++) {
                    if (data[i].rounds[j].name === 'Mexico City Grand Prix' || data[i].rounds[j].name === 'Mexican Grand Prix') {
                        data[i].rounds[j].flag = "..\\flags\\mex.svg";
                    }
                    else if (data[i].rounds[j].name === 'Argentine Grand Prix') {
                        data[i].rounds[j].flag = "..\\flags\\arg.svg";
                    }
                    else if (data[i].rounds[j].name === 'Australian Grand Prix') {
                        data[i].rounds[j].flag = "..\\flags\\aus.svg";
                    }
                    else if (data[i].rounds[j].name === 'Austrian Grand Prix' || data[i].rounds[j].name === 'Styrian Grand Prix') {
                        data[i].rounds[j].flag = "..\\flags\\aut.svg";
                    }
                    else if (data[i].rounds[j].name === 'Azerbaijan Grand Prix') {
                        data[i].rounds[j].flag = "..\\flags\\aze.svg";
                    }
                    else if (data[i].rounds[j].name === 'Bahrain Grand Prix' || data[i].rounds[j].name === 'Sakhir Grand Prix') {
                        data[i].rounds[j].flag = "..\\flags\\bhr.svg";
                    }
                    else if (data[i].rounds[j].name === 'Belgian Grand Prix') {
                        data[i].rounds[j].flag = "..\\flags\\bel.svg";
                    }
                    else if (data[i].rounds[j].name === 'Brazilian Grand Prix' || data[i].rounds[j].name === 'São Paulo Grand Prix') {
                        data[i].rounds[j].flag = "..\\flags\\bra.svg";
                    }
                    else if (data[i].rounds[j].name === 'Canadian Grand Prix') {
                        data[i].rounds[j].flag = "..\\flags\\can.svg";
                    }
                    else if (data[i].rounds[j].name === 'Chinese Grand Prix') {
                        data[i].rounds[j].flag = "..\\flags\\chn.svg";
                    }
                    else if (data[i].rounds[j].name === 'French Grand Prix') {
                        data[i].rounds[j].flag = "..\\flags\\fra.svg";
                    }
                    else if (data[i].rounds[j].name === 'German Grand Prix' || data[i].rounds[j].name === 'Eifel Grand Prix') {
                        data[i].rounds[j].flag = "..\\flags\\deu.svg";
                    }
                    else if (data[i].rounds[j].name === 'Luxembourg Grand Prix') {
                        data[i].rounds[j].flag = "..\\flags\\lux.svg";
                    }
                    else if (data[i].rounds[j].name === 'European Grand Prix') {
                        data[i].rounds[j].flag = "..\\flags\\eun.svg";
                    }
                    else if (data[i].rounds[j].name === 'Hungarian Grand Prix') {
                        data[i].rounds[j].flag = "..\\flags\\hun.svg";
                    }
                    else if (data[i].rounds[j].name === 'Indian Grand Prix') {
                        data[i].rounds[j].flag = "..\\flags\\ind.svg";
                    }
                    else if (data[i].rounds[j].name === 'Italian Grand Prix' || data[i].rounds[j].name === 'Tuscan Grand Prix' || data[i].rounds[j].name === 'Emilia Romagna Grand Prix') {
                        data[i].rounds[j].flag = "..\\flags\\ita.svg";
                    }
                    else if (data[i].rounds[j].name === 'Japanese Grand Prix') {
                        data[i].rounds[j].flag = "..\\flags\\jpn.svg";
                    }
                    else if (data[i].rounds[j].name === 'Malaysian Grand Prix') {
                        data[i].rounds[j].flag = "..\\flags\\mys.svg";
                    }
                    else if (data[i].rounds[j].name === 'Monaco Grand Prix') {
                        data[i].rounds[j].flag = "..\\flags\\mco.svg";
                    }
                    else if (data[i].rounds[j].name === 'San Marino Grand Prix') {
                        data[i].rounds[j].flag = "..\\flags\\smr.svg";
                    }
                    else if (data[i].rounds[j].name === 'Dutch Grand Prix') {
                        data[i].rounds[j].flag = "..\\flags\\nld.svg";
                    }
                    else if (data[i].rounds[j].name === 'Portuguese Grand Prix') {
                        data[i].rounds[j].flag = "..\\flags\\prt.svg";
                    }
                    else if (data[i].rounds[j].name === 'Qatar Grand Prix') {
                        data[i].rounds[j].flag = "..\\flags\\qat.svg";
                    }
                    else if (data[i].rounds[j].name === 'Russian Grand Prix') {
                        data[i].rounds[j].flag = "..\\flags\\rus.svg";
                    }
                    else if (data[i].rounds[j].name === 'Saudi Arabian Grand Prix') {
                        data[i].rounds[j].flag = "..\\flags\\sau.svg";
                    }
                    else if (data[i].rounds[j].name === 'Singapore Grand Prix') {
                        data[i].rounds[j].flag = "..\\flags\\sgp.svg";
                    }
                    else if (data[i].rounds[j].name === 'Korean Grand Prix') {
                        data[i].rounds[j].flag = "..\\flags\\kor.svg";
                    }
                    else if (data[i].rounds[j].name === 'Spanish Grand Prix') {
                        data[i].rounds[j].flag = "..\\flags\\esp.svg";
                    }
                    else if (data[i].rounds[j].name === 'Turkish Grand Prix') {
                        data[i].rounds[j].flag = "..\\flags\\tur.svg";
                    }
                    else if (data[i].rounds[j].name === 'Abu Dhabi Grand Prix') {
                        data[i].rounds[j].flag = "..\\flags\\are.svg";
                    }
                    else if (data[i].rounds[j].name === 'British Grand Prix' || data[i].rounds[j].name === '70th Anniversary Grand Prix') {
                        data[i].rounds[j].flag = "..\\flags\\gbr.svg";
                    }
                    else if (data[i].rounds[j].name === 'United States Grand Prix') {
                        data[i].rounds[j].flag = "..\\flags\\usa.svg";
                    }
                }
            }
            var result = JSON.stringify(data, null, 4);
            fs.writeFile('..\\frontend\\data\\seasons.json', result, (err) => {
                if (err) throw err;
                console.log("Completed!");
            });
        });
    }
}

module.exports = Data;