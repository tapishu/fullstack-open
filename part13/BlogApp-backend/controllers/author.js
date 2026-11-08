const router = require('express').Router()

const { User, Blog } = require('../models')
const { sequelize } = require('../util/db')

router.get('/', async (req, res) => {
  // const users = await User.findAll()
  // res.json(users)
    const authors = await Blog.findAll({    
    attributes: ['author', 
      [sequelize.fn("COUNT",sequelize.col("blog")),"blogs"],
    [sequelize.fn("SUM", sequelize.col("likes")),"likes"]
    ],
    group:["author"]
  })  
  res.json(authors)
})

module.exports = router
