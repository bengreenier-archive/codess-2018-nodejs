const express = require('express')
const uuid = require('uuid/v4')
const bodyParser = require('body-parser')
const Message = require('../models/message')

const router = express.Router()

router.get('/', (req, res) => {
  res.send(Message.All())
})

router.post('/', bodyParser.json(), (req, res) => {
  if (!req.body.username || !req.body.contents) {
    return res.status(400).end()
  }

  let id = uuid()

  // TODO(bengreenier): this is kind of a silly slow approach, we could refactor and improve
  while (Message.All().filter(model => model.id === id).length > 0) {
    id = uuid()
  }

  res.send(new Message({id, username: req.body.username, contents: req.body.contents}).save())
})

router.get('/:messageId', (req, res) => {
  res.send(Message.First(model => model.id === req.params.messageId))
})

router.put('/:messageId', bodyParser.json(), (req, res) => {
  const model = Message.First(model => model.id === req.params.messageId)
  model.username = model.username || req.body.username
  model.contents = model.contents || req.body.contents

  Message.Save(model)

  res.send(model)
})

router.delete('/:messageId', (req, res) => {
  let model = Message.First(model => model.id === req.params.messageId)

  Message.Delete(model)

  res.status(200).end()
})

module.exports = router
