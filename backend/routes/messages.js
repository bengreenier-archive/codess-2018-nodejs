const express = require('express')
const uuid = require('uuid/v4')
const bodyParser = require('body-parser')
const Message = require('../models/message')

// create an instance of a router
// this will be the component on which we define all messages routes
// we can mount this on the main server application as needed
const router = express.Router()

// here we define the GET / path for wherever this router is mounted
// for instance, if it's mounted @ /messages, this handles GET requests to /messages
router.get('/', (req, res) => {
  res.send(Message.All())
})

// here we define the POST / path for wherever this router is mounted
// for instance, if it's mounted @ /messages, this handles POST requests to /messages
router.post('/', bodyParser.json(), (req, res) => {
  // if we're missing certain parameters in the body, we error out
  if (!req.body.username || !req.body.contents) {
    return res.status(400).end()
  }

  // create a new message id
  let id = uuid()

  // TODO(bengreenier): this is kind of a silly slow approach, we could refactor and improve
  while (Message.All().filter(model => model.id === id).length > 0) {
    id = uuid()
  }

  // create and save the message, then send it back to the client as JSON
  // note: express (the server framework) will automatically convert this object to JSON
  res.send(new Message({id, username: req.body.username, contents: req.body.contents}).save())
})

// here we define the GET /<id> path for wherever this router is mounted
// for instance, if it's mounted @ /messages, this handles GET requests to /messages/<id>, like /messages/12345
router.get('/:messageId', (req, res) => {
  // here we simply get the first model that matches the messageId parameter and send it back to the user
  // note: express (the server framework) will automatically convert this object to JSON
  res.send(Message.First(model => model.id === req.params.messageId))
})

// here we define the PUT /<id> path for wherever this router is mounted
// for instance, if it's mounted @ /messages, this handles PUT requests to /messages/<id>, like /messages/12345
router.put('/:messageId', bodyParser.json(), (req, res) => {
  // here we simply get the first model that matches the messageId parameter
  const model = Message.First(model => model.id === req.params.messageId)

  // then we modify it using the given values (if any are given)
  model.username = model.username || req.body.username
  model.contents = model.contents || req.body.contents

  // then we save it back to the database
  Message.Save(model)

  // and then we send the modified version back to the user
  // note: express (the server framework) will automatically convert this object to JSON
  res.send(model)
})

router.delete('/:messageId', (req, res) => {
  // here we simply get the first model that matches the messageId parameter
  let model = Message.First(model => model.id === req.params.messageId)

  // then we delete it from the database
  Message.Delete(model)

  // and then we send the user a 200 status code with an empty body
  res.status(200).end()
})

// we export the router instance from this file, so that when we import it, we get the configured instance of the router
module.exports = router
