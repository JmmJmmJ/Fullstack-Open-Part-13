const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')
const Session = require('../models/session')

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

router.post('/', async (request, response) => {
  const token = getTokenFrom(request)

  await Session.destroy({
    where: {
      token: token
    }
  })

  response
    .status(200)
    .send( 'Logged out' )
})

module.exports = router