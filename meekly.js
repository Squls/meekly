const Twitter = require('twitter');
const request = require('request');
const fs = require('fs');
const options = {
    url: 'http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=USERNAME&api_key=YOURAPIKEY&format=json&period=7day&limit=3',
    headers: {
        'User-Agent': 'Meekly'
    }
};

const client = new Twitter({
    consumer_key: 'CONSUMER KEY',
    consumer_secret: 'CONSUMER SECRET',
    access_token_key: 'ACCESS TOKEN KEY',
    access_token_secret: 'ACCESS TOKEN SECRET'
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

getMusic();
setInterval(getMusic, 604800000)
