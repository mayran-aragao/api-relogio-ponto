require('dotenv').config();

const express = require('express')
const mustache = require('mustache-express');
const pg = require('pg')
const cors = require('cors')
const Routes = require('./routes/index');
const bodyParser = require('body-parser');



const server = express()

server.use(cors())
server.use(express.json({limit: '5mb'}))
server.use(express.urlencoded({extended:true,limit: '5mb'}))

server.use('/',Routes);

server.use(express.static(__dirname+'../public'));

server.engine('mst', mustache(__dirname+'/views/partials', '.mst'));
server.set('view engine', 'mst');
server.set('views', __dirname + '/views');



server.listen(process.env.PORT);
