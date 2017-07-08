# meekly
Small Twitter bot that tweets your top artists based on last.fm scrobbles from the last week.

### installation

Run ```package.json``` to install dependencies by running:

```npm install```

### last.fm parameters

Update the last.fm request uri with your usernanme and API key.

```http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=klj3&api_key=3ca92f3285713bfa6409ac3abe72191b&format=json&period=7day&limit=3```
