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
    url: 'http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=' + USERNAME + '&api_key=' + LASTFMAPIKEY + '&format=json&period=7day&limit=1',
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

let artist = null;

function getMusic() {
    request(options, function (error, response, body) {

        artists = 'My top artists this week: ';
        let result = JSON.parse(body)
        let title = result['toptracks']['track'][0]['name']
        let name = result['toptracks']['track'][0]['artist']['name']
        let img = result['toptracks']['track'][0]['image'][3]['#text']
        artist = "My obsession this week is '" + title + "' by " + name + " #nowplaying #music #myjam"
        
        request(img).pipe(fs.createWriteStream('meekly1.jpg'));

        setTimeout(tweet, 5000);

    });


}

function tweet() {

    var imgfile = fs.readFileSync('meekly1.jpg');

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
getMusic()
schedule.scheduleJob('0 3 9 * * 6', function () {
    getMusic()
})