const express = require("express")
const http = require('http')
const cors = require('cors')

const app = express()
// Permite JSON (middleware)
const bodyParser = require('body-parser');
// req & res htttp
// const morgan = require('morgan');

const server = http.createServer(app)

server.listen(8080, '10.48.212.85',  () => {
    console.log("Servidor en puerto 8080")
})

// app.use(morgan())
app.use(bodyParser.json())
app.use(cors())

require('./server/routes/catalogos')(app);