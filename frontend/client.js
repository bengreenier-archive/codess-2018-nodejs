/* eslint-env browser */
/* global superagent:false Ractive:false */

// we create an instance of Ractive, a dom data binding framework
// and we target specific dom elements as both the rendered dom tree
// and the template that we use for input
//
// we also define the default data schema, into which we'll populate data
// that should be bound into the dom
let boundDomElement = new Ractive({
  target: '#target',
  template: '#template',
  data: {
    messages: []
  }
})

// we add a listen for an action called 'delete' and define it such that when
// the action is invoked, we delete the message identified by messageId
// note: context is part of the Ractive framework and is always the first arg
boundDomElement.on('delete', (context, messageId) => {
  // here we issue a request to the API to delete the message
  superagent
    .delete('/messages/' + messageId)
    .then((res) => {
      // if the request succeeds
      if (res.ok) {
        // we remove the message from the dom-bound rendered list
        // this tells Ractive to update it's data bindings, using this new filtered list
        const messages = boundDomElement.get('messages')
        boundDomElement.set('messages', messages.filter(m => m.id !== messageId))
      }
    })
})

// we add a listen for an action called 'post' and define it such that when
// the action is invoked, we create a message using values that the user input
// note: context is part of the Ractive framework and is always the first arg
boundDomElement.on('post', (context) => {
  // here, we lookup the specific dom nodes (by id) that have the values we need to create the message
  const usernameNode = document.querySelector('#username-text')
  const contentsNode = document.querySelector('#contents-text')

  // then we get their value
  const username = usernameNode.value
  const contents = contentsNode.value

  // here we issue a request creating the new message
  superagent
    .post('/messages')
    .send({username, contents})
    .then((res) => {
      // if the request succeeds
      if (res.ok) {
        // we erase the value fields from the dom nodes where user input occured
        usernameNode.value = ''
        contentsNode.value = ''

        // and we add the message to the dom-bound rendered list
        // this tells Ractive to update it's data bindings, using this new list
        const messages = boundDomElement.get('messages')
        messages.push(res.body)
        boundDomElement.set('messages', messages)
      }
    })
})

// we define a small function that checks if there's new messages that need to be rendered
function updateIfNeeded () {
  // here we issue the request to get all messages from the API
  superagent('/messages')
    .then((res) => {
      // if the request succeeds
      if (res.ok) {
        // we update the dom-bound rendered list
        // this tells Ractive to update it's data bindings, using this new list
        boundDomElement.set('messages', res.body)
      }
    })
}

// we use a browser global function to schedule a call to the updateIfNeeded function
// at an interval of every 5000ms. We also call it once initially, since the first scheduled
// call won't occur for another 5000ms and we don't want the user to need to wait
setInterval(updateIfNeeded, 5000)
updateIfNeeded()
