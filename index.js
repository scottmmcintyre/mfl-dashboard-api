var express = require('express');
var app = express();
var axios = require('axios');
var url = require('url');

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get("/url", (req, res, next) => {
    res.json(['Tony', 'Lisa']);
})

// app.get("/export/myleagues/:MFL_USER_ID", (req, res, next) => {
//     axios({
//         url: 'https://api.myfantasyleague.com/2018/export?TYPE=myleagues&FRANCHISE_NAMES=1&JSON=1',
//         method: "get",
//         headers: {
//             'Cookie': 'MFL_USER_ID=' + req.params.MFL_USER_ID
//         }
//     }).then((response) => res.json(response.data))
//     .catch( (err) => console.log(err));
// });

app.get("/export/myleagues/:MFL_USER_ID", (req, res, next) => {
    axios({
        url: 'https://api.myfantasyleague.com/2018/export?TYPE=myleagues&FRANCHISE_NAMES=1&JSON=1',
        method: "get",
        headers: {
            'Cookie': 'MFL_USER_ID=' + req.params.MFL_USER_ID
        }
    }).then((response) => {
        const leagues = {};
        const by_id = {};
        const all_ids = [];
        response.data.leagues.league.forEach( league => {
            const regex = /home\/(.*)/;
            var league_id_match = regex.exec(league.url);
            var league_id = league_id_match[1];
            by_id[league_id] = {
                ...league,
                league_id: league_id
            }
            all_ids.push(league_id);
        });
        leagues['byId'] = by_id;
        leagues['allIds'] = all_ids;
        res.json(leagues);
    })
    .catch( (err) => console.log(err));
});

// app.get("/export/players/:MFL_USER_ID", (req, res, next) => {
//     axios({
//         url: 'https://api.myfantasyleague.com/2018/export?TYPE=players&DETAILS=&SINCE=&PLAYERS=&JSON=1',
//         method: "get",
//         headers: {
//             'Cookie': 'MFL_USER_ID=' + req.params.MFL_USER_ID
//         }
//     }).then((response) => res.json(response.data))
//     .catch( (err) => console.log(err));
// });

app.get("/export/players/:MFL_USER_ID", (req, res, next) => {
    axios({
        url: 'https://api.myfantasyleague.com/2018/export?TYPE=players&DETAILS=&SINCE=&PLAYERS=&JSON=1',
        method: "get",
        headers: {
            'Cookie': 'MFL_USER_ID=' + req.params.MFL_USER_ID
        }
    }).then((response) => {
        const players = {};
        const by_id = {};
        const all_ids = [];

        response.data.players.player.forEach(player => {
            by_id[player.id] = player;
            all_ids.push(player.id);
        });

        players['byId'] = by_id;
        players['allIds'] = all_ids;
        res.json(players)
    })
    .catch( (err) => console.log(err));
});

app.get("/export/rosters/:MFL_USER_ID/league/:LEAGUE_ID/franchise/:FRANCHISE_ID", (req, res, next) => {
    axios({
        url: 'https://api.myfantasyleague.com/2018/export?TYPE=rosters&L='+ req.params.LEAGUE_ID +'&APIKEY=&FRANCHISE='+ req.params.FRANCHISE_ID +'&JSON=1',
        method: "get",
        headers: {
            'Cookie': 'MFL_USER_ID=' + req.params.MFL_USER_ID
        }
    }).then((response) => {
        const rosterData = {};
        const roster = [];

        response.data.rosters.franchise.player.forEach(player => {
            roster.push(player.id);
        });
        rosterData['roster'] = roster;
        rosterData['league_id'] = req.params.LEAGUE_ID;
        res.json(rosterData);
    })
    .catch( (err) => console.log(err));
});

app.listen(4000, () => {
    console.log("Server running on port 4000");
});