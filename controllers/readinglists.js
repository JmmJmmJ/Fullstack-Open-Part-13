const router = require('express').Router()

const models = require('../models')

router.post('/', async (req, res, next) => {
    try {
    const list = await models.Readinglist.create({ ...req.body, userId: req.body.user_id, blogId: req.body.blog_id })
      res.json(list)
    } catch(error) {
      next(error)
  }
  })

module.exports = router