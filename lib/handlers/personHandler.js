const { STATES } = require('../consts')
const Alexa = require('alexa-sdk')
const util = require('../util')
const people = require('../datasources/people')

module.exports = Alexa.CreateStateHandler(STATES.PERSON, util.joinWithDefaultHandlers({
  'ElementSelected': function () {
    const name = this.event.request.token
    people.findPerson(name)
      .then(person => util.showPerson.call(this, person))
      .catch((err) => util.handleError(this, err))
  },
  'Unhandled': function () {
    this.handler.state = ''
    this.emitWithState('People')
  },
  'PreviousIntent': function () {
    this.handler.state = ''
    this.emitWithState('People')
  },
  'Previous': function () {
    this.handler.state = ''
    this.emitWithState('People')
  }
}))
