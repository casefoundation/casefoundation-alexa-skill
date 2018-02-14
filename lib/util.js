const { STRINGS, CACHE_FILE_DIR } = require('./consts')
const md5 = require('md5')
const Jimp = require('jimp')
const { URL } = require('url')
const fs = require('fs-extra')
const path = require('path')
const urlManager = require('./urlManager')

exports.handleError = (intentContext, err) => {
  console.error(err)
  intentContext.response.speak(STRINGS.ERROR)
  this.emit(':responseReady')
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
    'People'
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
