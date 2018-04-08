let globalMessageStore = {}

module.exports = class Message {
  static All () {
    return Object.keys(globalMessageStore).map(k => globalMessageStore[k])
  }

  static First (pred) {
    return Message.All().filter(pred)[0]
  }

  static Delete (model) {
    delete globalMessageStore[model.id]
  }

  static Save (model) {
    globalMessageStore[model.id] = model
  }

  static Clear () {
    globalMessageStore = {}
  }

  constructor ({id, username, contents}) {
    if (typeof id !== 'string' || typeof username !== 'string' || typeof contents !== 'string') {
      throw new TypeError()
    }
    this.id = id
    this.username = username
    this.contents = contents
  }

  save () {
    Message.Save(this)
    return this
  }
}
