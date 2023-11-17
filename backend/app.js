const express = require("express")
const http = require('http')

const app = express()

const server = http.createServer(app)

server.listen(8080, () => {
    console.log("Servidor en puerto 8080")
})

require('./server/routes/catalogos')(app);