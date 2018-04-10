// to simplify this example, we're just going to store messages in a simple in-memory object
let globalMessageStore = {}

// here, we define the Message model
// this includes the properties of a Message, as well as some static helpers that enable us to query to 'database'
module.exports = class Message {
  /**
   * Get all Messages in the 'database'
   */
  static All () {
    return Object.keys(globalMessageStore).map(k => globalMessageStore[k])
  }

  /**
   * Get the first Message that matches a predicate function in the 'database'
   */
  static First (pred) {
    return Message.All().filter(pred)[0]
  }

  /**
   * Delete a particular messages from the 'database'
   */
  static Delete (model) {
    delete globalMessageStore[model.id]
  }

  /**
   * Save a particular message in to the 'database'
   */
  static Save (model) {
    globalMessageStore[model.id] = model
  }

  /**
   * Clear all Messages in the 'database'
   */
  static Clear () {
    globalMessageStore = {}
  }

  /**
   * Message contructor
   */
  constructor ({id, username, contents}) {
    if (typeof id !== 'string' || typeof username !== 'string' || typeof contents !== 'string') {
      throw new TypeError()
    }
    this.id = id
    this.username = username
    this.contents = contents
  }

  /**
   * Save the current message in to the 'database'
   */
  save () {
    Message.Save(this)
    return this
  }
}
