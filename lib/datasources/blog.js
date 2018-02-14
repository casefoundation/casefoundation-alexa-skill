const request = require('request-promise-native')
const { BLOGS_URL, MAX_BLOG_POSTS } = require('../consts')
const striptags = require('striptags')

exports.fetchPostsList = () => {
  return request({
    'uri': BLOGS_URL,
    'json': true
  })
    .then((posts) => {
      const mappedPosts = posts.map((post) => mapPostObject(post))
      return mappedPosts.slice(0, MAX_BLOG_POSTS)
    })
}

exports.findPost = (url) => {
  return exports.fetchPostsList()
    .then((blogs) => {
      return blogs.find(blog => blog.url === url)
    })
}

const mapPostObject = (post) => {
  // TODO: Safety check
  return {
    title: striptags(post.title.rendered),
    date: new Date(Date.parse(post.date_gmt)),
    author: post.acf.author && post.acf.author.post_title,
    url: post.link,
    excerpt: striptags(post.excerpt.rendered),
    content: striptags(post.content.rendered),
    image: {
      src: post.acf.teaser_image && post.acf.teaser_image.url.replace('localhost', 'casefoundation.org'),
      width: post.acf.teaser_image.width,
      height: post.acf.teaser_image.height
    }
  }
}
