const { STRINGS, STATES } = require('../consts')
const people = require('../datasources/people')
const Alexa = require('alexa-sdk')
const util = require('../util')
const {makeRichText} = Alexa.utils.TextUtils
const makeImage = Alexa.utils.ImageUtils.makeImage

module.exports = Alexa.CreateStateHandler(STATES.PERSON, util.joinWithDefaultHandlers({
  'ElementSelected': function () {
    const name = this.event.request.token
    people.findPerson(name)
      .then(person => {
        return util.makeDarkImage(person.image.src)
          .then(imageUrl => {
            return {
              imageUrl,
              person
            }
          })
      })
      .then(({imageUrl, person}) => {
        if (person) {
          const title = STRINGS.PERSON_INTRO + ' <emphasis level="reduced">' + person.name + '</emphasis>'
          if (this.event.context.System.device.supportedInterfaces.Display) {
            const builder = new Alexa.templateBuilders.BodyTemplate1Builder()

            const template = builder
              .setTitle(person.name)
              .setBackgroundImage(makeImage(imageUrl))
              .setTextContent(makeRichText('<font size="5">' + person.name + '</font>'), makeRichText('<font size="2">' + person.biography + '</font>'))
              .setToken(person.name)
              .build()

            this.response
              .speak(title)
              .renderTemplate(template)
          } else {
            this.response.speak(title + ' ' + person.biography)
          }
        } else {
          this.response.speak(STRINGS.PERSON_NOT_FOUND)
        }
        this.response.shouldEndSession(false)
        this.handler.state = STATES.PERSON
        this.emit(':responseReady')
      })
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
