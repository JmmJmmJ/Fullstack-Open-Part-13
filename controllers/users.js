const router = require('express').Router()

const models = require('../models')

router.get('/', async (req, res) => {
  const users = await models.User.findAll()
  res.json(users)
})

router.post('/', async (req, res, next) => {
  try {
    const user = await models.User.create(req.body)
    res.json(user)
  } catch(error) {
    next(error)
}
})

router.put('/:username', async (req, res, next) => {
    try {
        const user = await models.User.findOne({
            where: {
                username: req.params.username
            },
          });

          if (user) {
            user.username = req.body.username
            await user.save()
            res.json(user)
        } else {
            res.status(404).end
        }
    } catch(error) {
        next(error)
    }

  })

module.exports = router