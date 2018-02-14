const { STRINGS, STATIC_IMAGES } = require('../consts')
const { makeDarkImage, handleError } = require('../util')
const Alexa = require('alexa-sdk')
const makePlainText = Alexa.utils.TextUtils.makePlainText
const makeImage = Alexa.utils.ImageUtils.makeImage

module.exports = {
  'About': function () {
    makeDarkImage(STATIC_IMAGES.ABOUT)
      .then(imageUrl => {
        const builder = new Alexa.templateBuilders.BodyTemplate6Builder()

        const template = builder
          .setTitle(makePlainText(STRINGS.ABOUT_HEADER))
          .setTextContent(makePlainText(STRINGS.ABOUT_HEADER))
          .setBackgroundImage(makeImage(imageUrl))
          .setBackButtonBehavior('HIDDEN')
          .build()

        this.response
          .speak(STRINGS.ABOUT_TEXT + ' ' + STRINGS.NEXT_STATE_ASK)
          .renderTemplate(template)
          .listen(STRINGS.NEXT_STATE_ASK)

        this.emit(':responseReady')
      })
      .catch((err) => handleError(this, err))
  }
}
