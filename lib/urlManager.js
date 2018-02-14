const ngrok = require('ngrok')
const { PORT } = require('./consts')

let ngrokURL

exports.getURL = () => {
  return process.env.ROOT_URL || ngrokURL || 'http://localhost'
}

exports.initializeNgrok = (port) => {
  if (!process.env.ROOT_URL) {
    ngrok.once('connect', (url) => {
      console.log('Linked to ' + url)
      ngrokURL = url
    })
    ngrok.connect({
      addr: PORT,
      bind_tls: true,
      host_header: 'rewrite'
    })
  } else {
    console.log('Using supplied URL ' + process.env.ROOT_URL)
  }
}
