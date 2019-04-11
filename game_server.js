const express = require('express')
let gameport = 8000;
let app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/breakout2d.html');
});

app.listen(gameport, () => {
	console.log(`Game server listening on port ${gameport}`)
});