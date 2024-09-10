const router = require('express').Router()
const models = require('../models')

router.get('/', async (req, res, next) => {
    try {
        const blogs = await models.Blog.findAll({
            group: ['author'],
            attributes : ['author', [models.Blog.sequelize.fn('COUNT', 'author'), 'blogs'], [models.Blog.sequelize.fn('SUM', models.Blog.sequelize.col('likes')), 'likes']],
        })
        res.json(blogs)
    } catch (error) {
        next(error)
    }
})



module.exports = router