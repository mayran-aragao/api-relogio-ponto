require('dotenv').config();

const express = require('express')
const mustache = require('mustache-express');
const cors = require('cors')
const https = require('https');
const fs = require('fs');
const Routes = require('./routes/index');

// let options = {
//     cert: cert, // fs.readFileSync('./ssl/example.crt');
//     ca: ca, // fs.readFileSync('./ssl/example.ca-bundle');
//     key: key // fs.readFileSync('./ssl/example.key');
//  };

const server = express()

server.use(cors())
server.use(express.json({ limit: '5mb' }))
server.use(express.urlencoded({ extended: true, limit: '5mb' }))

server.use('/', Routes);

// const httpsServer = https.createServer({
//     key: fs.readFileSync('/etc/letsencrypt/live/my_api_url/privkey.pem'),
//     cert: fs.readFileSync('/etc/letsencrypt/live/my_api_url/fullchain.pem'),
// }, server);

// const httpsServer = https.createServer(options, (req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/html');
//     res.end("<h1>HTTPS server running</h1>");
//  });

// httpsServer.listen(443, () => {
//     console.log('HTTPS Server running on port 443');
// });

server.use(express.static(__dirname + '../public'));

server.engine('mst', mustache(__dirname + '/views/partials', '.mst'));
server.set('view engine', 'mst');
server.set('views', __dirname + '/views');


server.listen(process.env.PORT);
