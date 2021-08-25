require('dotenv').config();

const express = require('express')
const pg = require('pg')
const cors = require('cors')
const Routes = require('./routes/index')



const server = express()

server.use(cors())
server.use(express.json())
server.use(express.urlencoded({extended:true}))

server.use('/',Routes);

server.listen(process.env.PORT);
