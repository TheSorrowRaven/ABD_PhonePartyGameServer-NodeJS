const express = require('express');

const app = express();
const expressWs = require('express-ws')(app);

var rooms = {}

// serve all files in the Game folder
app.use(express.static('Game Server'));

const { gameServer } = require('./Server/gameServer.js');
const { phoneServer } = require('./Server/phoneServer.js');

gameServer(app, rooms)
phoneServer(app, rooms)

// start the server
app.listen(6969, () => {
    console.log('Server listening on port 6969');
});
