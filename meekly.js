const Twitter = require('twitter');
const request = require('request');
const schedule = require('node-schedule')
const env = require('node-env-file')
const fs = require('fs');

env(__dirname + '/.env')

let CONSUMER_KEY = process.env.TwitterConsumerKey
let CONSUMER_SECRET = process.env.TwitterConsumerSecret
let ACCESS_TOKEN_KEY = process.env.TwitterAccessKey
let ACCESS_TOKEN_SECRET = process.env.TwitterAccessSecret
let USERNAME = process.env.LastfmUser
let LASTFMAPIKEY = process.env.LastfmKey

const options = {
    url: 'http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=' + USERNAME + '&api_key=' + LASTFMAPIKEY + '&format=json&period=7day&limit=3',
    headers: {
        'User-Agent': 'Meekly'
    }
}


const client = new Twitter({
    consumer_key: CONSUMER_KEY,
    consumer_secret: CONSUMER_SECRET,
    access_token_key: ACCESS_TOKEN_KEY,
    access_token_secret: ACCESS_TOKEN_SECRET
});

let artists = null;

function getMusic() {
    request(options, function (error, response, body) {

        artists = 'My top artists this week: ';
        let result = JSON.parse(body)

        for (i = 0; i < result['topartists']['artist'].length; i++) {
            let name = result['topartists']['artist'][i]['name'];
            let c = result['topartists']['artist'][i]['playcount'];

            if (i < 2) {
                artists += name + ', '
            } else {
                artists += 'and ' + name + '. #music #nowplaying';
            }
        }
        setTimeout(tweet, 5000);

    });


}

function tweet() {    

    var body = {
    	status: artists
    }

    client.post('statuses/update', body, function (error, tweet, response) {});

}

schedule.scheduleJob('0 3 9 * * 7', function () {
    getMusic()
})
