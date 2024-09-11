const express = require("express")
const http = require('http')
const cors = require('cors')

const app = express()
// Permite JSON (middleware)
const bodyParser = require('body-parser');
// req & res htttp
const morgan = require('morgan');

const server = http.createServer(app)

const port = 8880

server.listen(port, () => {
    console.log(`Servidor en puerto ${port}`)
})

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cors())

module.exports = app