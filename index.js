const express = require('express');

const projects = require('./projectRouter');
const actions = require('./actionRouter');

const server = express();

const PORT = 5000;

server.use(express.json());
server.use('/api/projects', projects);
server.use('/api/actions', actions);

server.listen(PORT, err=>{
    console.log(`Server running on port: ${PORT}`);
})