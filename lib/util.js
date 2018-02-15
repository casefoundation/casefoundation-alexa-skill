const { STRINGS, CACHE_FILE_DIR } = require('./consts')
const md5 = require('md5')
const Jimp = require('jimp')
const { URL } = require('url')
const fs = require('fs-extra')
const path = require('path')
const urlManager = require('./urlManager')
const Alexa = require('alexa-sdk')
const {makeRichText} = Alexa.utils.TextUtils
const makeImage = Alexa.utils.ImageUtils.makeImage

exports.handleError = (intentContext, err) => {
  console.log('here!!')
  console.error(err)
  intentContext.response.speak(STRINGS.ERROR)
  intentContext.emit(':responseReady')
}

exports.makeDarkImage = (urlStr, override = false) => {
  const url = new URL(urlStr)
  const pathParts = url.pathname.split('/')
  const extenion = pathParts[pathParts.length - 1].substring(pathParts[pathParts.length - 1].indexOf('.') + 1)
  const fileName = md5(urlStr) + '.' + extenion
  const filePath = path.join(CACHE_FILE_DIR, fileName)
  return fs.exists(filePath)
    .then(exists => {
      if (override || !exists) {
        return Jimp.read(urlStr)
          .then(image => {
            return image
              .brightness(-0.75)
              .write(filePath)
          })
      }
    })
    .then(() => urlManager.getURL() + '/image/' + fileName)
}

exports.joinWithDefaultHandlers = (handlers) => {
  const intents = [
    'About',
    'Blog',
    'People',
    'Bio'
  ]
  const defaults = {}
  intents.forEach(intent => {
    defaults[intent] = function () {
      this.handler.state = ''
      this.emitWithState(intent)
    }
  })
  return Object.assign(defaults, handlers)
}

exports.showPerson = function (person) {
  if (person) {
    return exports.makeDarkImage(person.image.src)
      .then(imageUrl => {
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
        this.response.shouldEndSession(false)
        this.handler.state = ''
        this.emit(':responseReady')
      })
  } else {
    this.response.speak(STRINGS.PERSON_NOT_FOUND)
  }
}
