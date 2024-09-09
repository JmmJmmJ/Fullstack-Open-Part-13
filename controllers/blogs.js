const router = require('express').Router()

const models = require('../models')

router.get('/', async (req, res) => {
    const blogs = await models.Blog.findAll()
    res.json(blogs)
  })
  
  router.post('/', async (req, res, next) => {
    try {
      console.log(req.body)
    const blog = await models.Blog.create(req.body)
    return res.json(blog)
    } catch(error) {
      next(error)
    }
  })
  
  router.delete('/:id', async (req, res) => {
    const id = req.params.id
    await models.Blog.destroy({
      where: {
        id: id
      }
    })
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
    } catch(error) {
        next(error)
    }

  })

  module.exports = router