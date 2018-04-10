const express = require('express')
const messages = require('./routes/messages')

// we export a function that will act as a sort of 'creator' for our application
// that is, other folks can call it and we'll return a new instance of the app!
module.exports = () => {
  // create the app
  const app = express()

  // configure our routes
  // in this case, we use the imported messages router and mount it at /messages
  // all the child routes that are defined on the router will now be put under /messages
  app.use('/messages', messages)

  // return the app instance
  return app
}
