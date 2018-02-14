const Alexa = require('alexa-sdk')
const handlers = require('./lib/handlers')
const { APP_ID } = require('./lib/consts')

exports.handler = (event, context) => {
  const alexa = Alexa.handler(event, context)
  alexa.registerHandlers(
    handlers.aboutHandlers,
    handlers.blogsHandlers,
    handlers.newSessionHandlers,
    handlers.peopleHandlers,
    handlers.postHandler,
    handlers.personHandler
  )
  alexa.appId = APP_ID
  alexa.execute()
}
