const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const handler = require('./index').handler
const fs = require('fs-extra')
const path = require('path')
const { CACHE_FILE_DIR, PORT } = require('./lib/consts')
const urlManager = require('./lib/urlManager')

const app = express()
app.use(bodyParser.json())
app.use(logger('tiny'))
app.post('/', (req, res) => {
  const context = {
    succeed: (result) => {
      // console.log(JSON.stringify(result, null, '  '))
      res.json(result)
    },
    fail: (error) => {
      console.log(error)
    }
  }
  handler(req.body, context)
})

app.get('/image/:image', (req, res, next) => {
  const regex = /[a-fA-F0-9]*\.(jpg|png|jpeg|gif)/g
  const matches = regex.exec(req.params.image)
  if (matches.length > 1) {
    const file = path.join(CACHE_FILE_DIR, matches[0])
    fs.readFile(file)
      .then(buffer => {
        res.setHeader('Content-type', 'image/' + matches[1])
        res.send(buffer)
      })
      .catch(err => next(err))
  } else {
    res.sendStatus(401)
  }
})

app.listen(PORT, (err) => {
  if (err) {
    console.error(err)
    process.exit(-1)
  } else {
    urlManager.initializeNgrok()
    console.log('Running!')
  }
})
