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
let LASTFMAPIKEY = process.envLastfmKey

const options = {
    url: 'http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=' + USERNAME + '&api_key=' + LASTFMAPIKEY + '&format=json&period=7day&limit=3',
    headers: {
        'User-Agent': 'Meekly'
    }
}


const client = new Twitter({
    consumer_key: 'CONSUMER_KEY',
    consumer_secret: 'CONSUMER_SECRET',
    access_token_key: 'ACCESS_TOKEN_KEY',
    access_token_secret: 'ACCESS_TOKEN_SECRET'
});

var artists = 'My top artists this week: ';

function getMusic() {
    request(options, function (error, response, body) {

        let result = JSON.parse(body)

        for (i = 0; i < result['topartists']['artist'].length; i++) {
            let name = result['topartists']['artist'][i]['name'];
            let c = result['topartists']['artist'][i]['playcount'];
            if (i == 0) {
                let img = result['topartists']['artist'][i]['image'][4]['#text'];
                request(img).pipe(fs.createWriteStream('meekly' + i + '.jpg'));
            }
            if (i < 2) {
                artists += ', '
            } else {
                artists += '. #music';
            }
        }
        setTimeout(tweet, 5000);

    });


}

function tweet() {

    var imgfile = fs.readFileSync('meekly0.jpg');

    client.post('media/upload', {
        media: [imgfile]
    }, function (error, media, response) {

        if (!error) {

            var status = {
                status: artists,
                media_ids: media.media_id_string
            }

            client.post('statuses/update', status, function (error, tweet, response) {});

        }
    })
}

schedule.scheduleJob('0 10 * * 6', function () {
    getMusic()
})