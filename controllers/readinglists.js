const router = require('express').Router()
const { SECRET } = require('../util/config')
const models = require('../models')
const Session = require('../models/session')
const jwt = require('jsonwebtoken')

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

router.post('/', async (req, res, next) => {
  try {
    const list = await models.Readinglist.create({ ...req.body, userId: req.body.user_id, blogId: req.body.blog_id })
    res.json(list)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, SECRET);

    const session = await Session.findOne({
      where: {
        token: token
      }
    })

    if (!token || !decodedToken.id || !session) {
      return response.status(401).json({ error: "token missing or invalid" });
    }

    lista = await models.Readinglist.findByPk(req.params.id)
    if (lista.userId == decodedToken.id) {
      lista.read = req.body.read
      await lista.save()
      res.json(lista)
    } else {
      return response.status(400).json({ error: "can't find" });
    }

  } catch (error) {
    next(error)
  }
})

module.exports = router