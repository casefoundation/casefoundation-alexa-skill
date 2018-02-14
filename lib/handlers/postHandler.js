const { STRINGS, STATES } = require('../consts')
const blog = require('../datasources/blog')
const Alexa = require('alexa-sdk')
const util = require('../util')
const {makeRichText} = Alexa.utils.TextUtils
const makeImage = Alexa.utils.ImageUtils.makeImage

module.exports = Alexa.CreateStateHandler(STATES.POST, util.joinWithDefaultHandlers({
  'ElementSelected': function () {
    const url = this.event.request.token
    blog.findPost(url)
      .then(post => {
        return util.makeDarkImage(post.image.src)
          .then(imageUrl => {
            return {
              imageUrl,
              post
            }
          })
      })
      .then(({imageUrl, post}) => {
        if (post) {
          const title = STRINGS.POST_INTRO + ' <emphasis level="reduced">' + post.title + '</emphasis>'
          if (this.event.context.System.device.supportedInterfaces.Display) {
            const builder = new Alexa.templateBuilders.BodyTemplate1Builder()

            const template = builder
              .setTitle(post.title)
              .setBackgroundImage(makeImage(imageUrl))
              .setTextContent(makeRichText('<font size="5">' + post.title + '</font>'), makeRichText('<font size="2">' + post.content + '</font>'))
              .setToken(post.url)
              .build()

            this.response
              .speak(title)
              .renderTemplate(template)
          } else {
            this.response.speak(title + ' ' + post.excerpt + '. ' + STRINGS.BLOG_AND_POST_OUTRO)
          }
        } else {
          this.response.speak(STRINGS.POST_NOT_FOUND)
        }
        this.response.shouldEndSession(false)
        this.handler.state = ''
        this.emit(':responseReady')
      })
      .catch((err) => util.handleError(this, err))
  },
  'Unhandled': function () {
    this.handler.state = ''
    this.emitWithState('Blog')
  },
  'PreviousIntent': function () {
    this.handler.state = ''
    this.emitWithState('Blog')
  },
  'Previous': function () {
    this.handler.state = ''
    this.emitWithState('Blog')
  }
}))
