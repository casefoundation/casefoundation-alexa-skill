['aboutHandlers', 'blogsHandlers', 'newSessionHandlers', 'peopleHandlers', 'postHandler', 'personHandler'].forEach((file) => {
  module.exports[file] = require('./' + file)
})
