const { STRINGS, STATES } = require('../consts')
const blog = require('../datasources/blog')
const Alexa = require('alexa-sdk')
const makePlainText = Alexa.utils.TextUtils.makePlainText
const makeImage = Alexa.utils.ImageUtils.makeImage
const util = require('../util')

module.exports = {
  'Blog': function () {
    blog.fetchPostsList()
      .then((posts) => {
        if (this.event.context.System.device.supportedInterfaces.Display) {
          const listItemBuilder = new Alexa.templateBuilders.ListItemBuilder()
          posts.forEach((post) => {
            const postImage = makeImage(post.image.src, post.image.width, post.image.height)
            listItemBuilder.addItem(postImage, post.url, makePlainText(post.title))
          })

          const listTemplateBuilder = new Alexa.templateBuilders.ListTemplate1Builder()
          const listTemplate = listTemplateBuilder
            .setToken('posts')
            .setTitle('Recent Posts')
            .setListItems(listItemBuilder.build())
            .setBackButtonBehavior('HIDDEN')
            .build()

          this.response
            .speak(STRINGS.BLOG_INTRO + ' ' + STRINGS.BLOG_AND_POST_OUTRO)
            .renderTemplate(listTemplate)
        } else {
          this.response.speak(STRINGS.BLOG_INTRO + ' ' + posts.map((post) => post.title).join('. ') + ' ' + STRINGS.BLOG_AND_POST_OUTRO)
        }
        this.response.listen(STRINGS.BLOG_REPROMPT)
        this.handler.state = STATES.POST
        this.emit(':responseReady')
      })
      .catch((err) => util.handleError(this, err))
  }
}
