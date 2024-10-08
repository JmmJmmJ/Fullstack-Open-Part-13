const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const models = require('../models')
const Session = require('../models/session')
const { Op } = require('sequelize');

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(authorization.substring(7))
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch (error) {
      console.log(error)
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

router.get('/', async (req, res) => {
  const search = req.query.search

  if (!search) {
  const blogs = await models.Blog.findAll({
    include: {
      model: models.User
    },
    order: [
      ['likes', 'DESC']
    ]
  })
  res.json(blogs)
} else {
  const blogs = await models.Blog.findAll({
    include: {
      model: models.User
    },
    where: {
      [Op.or]: [{title: search}, {author: search}],
    },
    order: [
      ['likes', 'DESC']
    ]
  })
  res.json(blogs)
}
})

router.post('/', async (req, res, next) => {
  try {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, SECRET);
    const session = await Session.findOne({
      where: {
        token: token
      }
    })

    if (!token || !decodedToken.id || !session) {
      return res.status(401).json({ error: "Token missing or invalid" });
    }

    if (decodedToken.disabled) {
      return res.status(401).json({ error: "Account disabled" });
    }

    const user = await models.User.findByPk(decodedToken.id)
    const blog = await models.Blog.create({ ...req.body, userId: user.id })
    return res.json(blog)
  } catch (error) {
    next(error)
  }
})

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

router.delete('/:id', async (req, res, next) => {
  try {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, SECRET);
    const session = await Session.findOne({
      where: {
        token: token
      }
    })

    if (!token || !decodedToken.id || !session) {
      return res.status(401).json({ error: "Token missing or invalid" });
    }

    if (decodedToken.disabled) {
      return res.status(401).json({ error: "Account disabled" });
    }

    const id = req.params.id
    const blog = await models.Blog.findOne({
      where: {
        id: id
      },
    });


    if (blog.userId == decodedToken.id) {
      await models.Blog.destroy({
        where: {
          id: id
        }
      })
    }
  } catch(error) {
    next(error)
  }
  res.status(200).end()
})

router.put('/:id', async (req, res, next) => {
  try {
    blog = await models.Blog.findByPk(req.params.id)

    if (blog) {
      blog.likes = req.body.likes
      await blog.save()
      res.json(blog)
    } else {
      res.status(404).end
    }
  } catch (error) {
    next(error)
  }

})

module.exports = router