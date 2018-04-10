/* eslint-env browser */
/* global superagent:false Ractive:false */

let boundDomElement = new Ractive({
  target: '#target',
  template: '#template',
  data: {
    messages: []
  }
})

boundDomElement.on('delete', (context, messageId) => {
  superagent
    .delete('/messages/' + messageId)
    .then((res) => {
      if (res.ok) {
        const messages = boundDomElement.get('messages')
        boundDomElement.set('messages', messages.filter(m => m.id !== messageId))
      }
    })
})

boundDomElement.on('post', (context) => {
  // use dom navigation (this is semi-brittle) to find the values
  const usernameNode = document.querySelector('#username-text')
  const contentsNode = document.querySelector('#contents-text')
  const username = usernameNode.value
  const contents = contentsNode.value

  superagent
    .post('/messages')
    .send({username, contents})
    .then((res) => {
      if (res.ok) {
        usernameNode.value = ''
        contentsNode.value = ''

        const messages = boundDomElement.get('messages')
        messages.push(res.body)
        boundDomElement.set('messages', messages)
      }
    })
})

function updateIfNeeded () {
  superagent('/messages')
    .then((res) => {
      if (res.ok) {
        boundDomElement.set('messages', res.body)
      }
    })
}

setInterval(updateIfNeeded, 5000)
updateIfNeeded()
