exports.APP_ID = process.env.APP_ID

exports.STRINGS = {
  INTRO: 'Welcome to the Case Foundation.',
  INTRO_SUBHEAD: 'Investing in people and ideas that can change the world.',
  INTRO_PROMPT: 'Would you like to learn more about our mission, staff, or latest blog posts?',
  ABOUT_HEADER: 'About the Case Foundation',
  ABOUT_TEXT: '<emphasis level="reduced">The Case Foundation</emphasis>, created by digital pioneers <emphasis level="reduced">Jean</emphasis> and <emphasis level="reduced">Steve Case</emphasis>, is a diverse and dynamic institution by design. We create programs and invest in people and organizations that harness the best impulses of entrepreneurship, innovation, technology and collaboration to drive exponential impact.',
  BLOG_INTRO: 'Here are the latest posts from our blog.',
  BLOG_AND_POST_OUTRO: 'For more, visit Case Foundation Dot Org Slash Blog.',
  BLOG_REPROMPT: 'Select or name one to read it.',
  PEOPLE_INTRO: 'Here\'s a look at our team. Select a team member to learn more.',
  PEOPLE_HEADLESS_TEXT: 'The Case Foundation has a team of TEAM_SIZE. To learn more about our team, visit Case Foundation dot and click on About Us, Our Team',
  PERSON_NOT_FOUND: 'Sorry, I don\'t know. For a list of the team at the Case Foundation, say team',
  ERROR: 'Sorry, an error occurred. Please ask again in a little while',
  PERSON_INTRO: 'Here\'s the bio for',
  POST_INTRO: 'Here\'s the blog post',
  POST_NOT_FOUND: 'Sorry, I couldn\'t find that post.',
  NEXT_STATE_ASK: 'What else would you like to know about the Case Foundation?',
  NOT_SURE: 'Hm. I\'m not sure.'
}

exports.FEED_BASE = 'https://casefoundation.org/'
exports.MAX_BLOG_POSTS = 5
exports.BLOGS_URL = exports.FEED_BASE + '/wp-json/wp/v2/posts?order_by=date&per_page=' + exports.MAX_BLOG_POSTS
exports.PEOPLE_URL = exports.FEED_BASE + '/wp-json/wp/v2/profile?per_page=100'

exports.NAMES = {
  JEAN: 'Jean Case',
  STEVE: 'Steve Case'
}

exports.STATES = {
  PERSON: 'PERSON',
  POST: 'POST'
}

exports.STATIC_IMAGES = {
  GENERAL: 'https://casefoundation.org/wp-content/uploads/2014/10/BE-fearless-hero.jpg',
  ABOUT: 'https://casefoundation.org/wp-content/uploads/2014/12/Hero_WhatWeveLearned1_1440x647_acf_cropped-1440x647.jpg'
}

exports.CACHE_FILE_DIR = process.env.CACHE_FILE_DIR || './images'

exports.PORT = 8000
