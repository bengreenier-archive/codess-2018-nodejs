const request = require('supertest')
const Message = require('../backend/models/message')
const backendAllocator = require('../backend')
/* eslint-env node, mocha */

describe('/messages', () => {
  beforeEach(() => {
    Message.Clear()
  })

  it('GET / (none)', (done) => {
    request(backendAllocator())
      .get('/messages')
      .expect(200, [], done)
  })

  it('GET / (some)', (done) => {
    const app = backendAllocator()
    const testMessage = new Message({id: '1', username: 'test', contents: 'message'}).save()

    request(app)
      .get('/messages')
      .expect(200, [testMessage], done)
  })

  it('POST /', (done) => {
    const app = backendAllocator()

    request(app)
      .post('/messages')
      .send({username: 'test', contents: 'test data'})
      .expect(200, done)
  })

  it('GET /:messageId', (done) => {
    const app = backendAllocator()
    const testMessage = new Message({id: '1', username: 'test', contents: 'message'}).save()

    request(app)
      .get(`/messages/${testMessage.id}`)
      .expect(200, testMessage, done)
  })

  it('PUT /:messageId', (done) => {
    const app = backendAllocator()
    const testMessage = new Message({id: '1', username: 'test', contents: 'message'}).save()

    testMessage.contents = 'new contents'

    request(app)
      .put(`/messages/${testMessage.id}`)
      .send(testMessage)
      .expect(200, testMessage, done)
  })

  it('DEL /:messageId', (done) => {
    const app = backendAllocator()
    const testMessage = new Message({id: '1', username: 'test', contents: 'message'}).save()

    request(app)
      .delete(`/messages/${testMessage.id}`)
      .expect(200, done)
  })
})
