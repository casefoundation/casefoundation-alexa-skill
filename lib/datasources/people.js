const request = require('request-promise-native')
const { PEOPLE_URL, NAMES } = require('../consts')
const striptags = require('striptags')

exports.fetchPeopleList = () => {
  return request({
    'uri': PEOPLE_URL,
    'json': true
  })
    .then((people) => {
      const mappedPeople = people
        .map((person) => mapPeopleObject(person))
        .filter((person) => person.name !== 'Default Case Foundation')
      mappedPeople.sort((a, b) => {
        if (a.name === NAMES.JEAN) {
          return -1
        } else if (b.name === NAMES.JEAN) {
          return 1
        } else if (a.name === NAMES.STEVE) {
          if (b.name === NAMES.JEAN) {
            return 1
          } else {
            return -1
          }
        } else if (b.name === NAMES.STEVE) {
          if (a.name === NAMES.JEAN) {
            return -1
          } else {
            return 1
          }
        } else {
          const lastName = a.lastName.localeCompare(b.lastName)
          if (lastName === 0) {
            return a.firstName.localeCompare(b.firstName)
          } else {
            return lastName
          }
        }
      })
      return mappedPeople
    })
}

exports.findPerson = (name) => {
  return exports.fetchPeopleList()
    .then((people) => {
      const lcName = name.toLowerCase()

      const byFullName = people.find((person) => person.name.toLowerCase() === lcName)
      if (byFullName) {
        return byFullName
      }
      const byLastName = people.find((person) => person.lastName.toLowerCase() === lcName)
      if (byLastName) {
        return byLastName
      }
      const byFirstName = people.find((person) => person.firstName.toLowerCase() === lcName)
      if (byFirstName) {
        return byFirstName
      }
      return null
    })
}

const mapPeopleObject = (person) => {
  // TODO: Safety check
  return {
    name: striptags(person.title.rendered),
    lastName: striptags(person.acf.last_name),
    firstName: striptags(person.acf.first_name),
    position: person.acf.position,
    biography: striptags(person.acf.bio),
    image: {
      src: person.acf.profile_thumbnail.url.replace('localhost', 'casefoundation.org'),
      width: person.acf.profile_thumbnail.width,
      height: person.acf.profile_thumbnail.height
    }
  }
}
