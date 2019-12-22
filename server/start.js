#!/usr/bin/env node
import debug from 'debug'
import http from 'http'
import app from './app'
import appVariables from '../config/variables/app_variables'

// Get port from environment and store in Express.
// local post set as variable
const port = normalizePort(process.env.PORT || appVariables.defaultAppPort)
app.set('port', port)

// Create HTTP server.
const server = http.createServer(app)

// Listen on provided port, on all network interfaces.
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

// Normalize a port into a number, string, or false.
function normalizePort(val) {
  const portItem = parseInt(val, 10)

  if (isNaN(portItem)) {
    // named pipe
    return val
  }

  if (portItem >= 0) {
    // port number
    return portItem
  }

  return false
}

// Event listener for HTTP server "error" event.
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`)
      process.exit(1)
      break
    default:
      throw error
  }
}

// Event listener for HTTP server "listening" event.
function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
  debug(`Listening on ${bind}`)
}
