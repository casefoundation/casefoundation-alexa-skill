const { STRINGS, STATES } = require('../consts')
const people = require('../datasources/people')
const Alexa = require('alexa-sdk')
const makePlainText = Alexa.utils.TextUtils.makePlainText
const makeImage = Alexa.utils.ImageUtils.makeImage
const util = require('../util')

module.exports = {
  'People': function () {
    people.fetchPeopleList()
      .then((people) => {
        if (this.event.context.System.device.supportedInterfaces.Display) {
          const listItemBuilder = new Alexa.templateBuilders.ListItemBuilder()
          people.forEach((person) => {
            const personImage = makeImage(person.image.src)
            listItemBuilder.addItem(personImage, person.name, makePlainText(person.name), makePlainText(person.position))
          })

          const listTemplateBuilder = new Alexa.templateBuilders.ListTemplate2Builder()
          const listTemplate = listTemplateBuilder
            .setToken('people')
            .setTitle('Our Team')
            .setListItems(listItemBuilder.build())
            .setBackButtonBehavior('HIDDEN')
            .build()

          this.response
            .speak(STRINGS.PEOPLE_INTRO)
            .renderTemplate(listTemplate)
        } else {
          this.response.speak(STRINGS.PEOPLE_HEADLESS_TEXT.replace('TEAM_SIZE', people.length))
        }
        this.response.shouldEndSession(false)
        this.handler.state = STATES.PERSON
        this.emit(':responseReady')
      })
      .catch((err) => util.handleError(this, err))
  }
}
