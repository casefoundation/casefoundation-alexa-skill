const { STRINGS, STATIC_IMAGES } = require('../consts')
const Alexa = require('alexa-sdk')
const {makePlainText, makeRichText} = Alexa.utils.TextUtils
const makeImage = Alexa.utils.ImageUtils.makeImage
const { makeDarkImage, handleError } = require('../util')

module.exports = {
  'LaunchRequest': function () {
    makeDarkImage(STATIC_IMAGES.GENERAL)
      .then(imageUrl => {
        const builder = new Alexa.templateBuilders.BodyTemplate6Builder()

        const template = builder
          .setTitle(makePlainText(STRINGS.INTRO))
          .setTextContent(makePlainText(STRINGS.INTRO), makeRichText('<font size="4">' + STRINGS.INTRO_SUBHEAD + '</font>'))
          .setBackgroundImage(makeImage(imageUrl))
          .setBackButtonBehavior('HIDDEN')
          .build()

        this.response
          .speak(STRINGS.INTRO + ' ' + STRINGS.INTRO_PROMPT)
          .renderTemplate(template)
          .listen(STRINGS.INTRO_PROMPT)

        this.emit(':responseReady')
      })
      .catch((err) => handleError(this, err))
  },
  'Unhandled': function () {
    this.response.speak(STRINGS.NOT_SURE + ' ' + STRINGS.INTRO_PROMPT).listen(STRINGS.INTRO_PROMPT)
    this.emit(':responseReady')
  },
  'SessionEndedRequest': function () {
    this.emit(':responseReady')
  }
}
