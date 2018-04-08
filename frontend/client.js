/* eslint-env browser */
/* global superagent:false Ractive:false */

let boundDomElement = new Ractive({
  target: '#target',
  template: '#template',
  data: {
    messages: []
  }
})

function updateIfNeeded () {
  superagent('/messages').then((res) => {
    if (res.ok) {
      boundDomElement.set('messages', res.body)
    }
  })
}

setInterval(updateIfNeeded, 5000)
updateIfNeeded()
