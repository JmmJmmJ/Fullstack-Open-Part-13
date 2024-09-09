const router = require('express').Router()

const models = require('../models')

router.get('/', async (req, res) => {
    const blogs = await models.Blog.findAll()
    res.json(blogs)
  })
  
  router.post('/', async (req, res) => {
    try {
      console.log(req.body)
    const blog = await models.Blog.create(req.body)
    return res.json(blog)
    } catch(error) {
      return res.status(400).json({error})
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

  module.exports = router