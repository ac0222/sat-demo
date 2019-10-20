const express = require('express')
const config = require('./config');
let app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/index.html');
});

app.get('/breakout', (req, res) => {
	res.sendFile(__dirname + '/views/breakout2d.html');
})

app.listen(config.PORT, () => {
	console.log(`Game server listening on port ${config.PORT}`)
});