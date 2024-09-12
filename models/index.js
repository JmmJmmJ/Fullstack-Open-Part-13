const Blog = require('./blog')
const User = require('./user')
const Readinglist = require('./readinglist')

User.hasMany(Blog, {as: 'ownedblogs' })
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: Readinglist, as: 'reading' })
Blog.belongsToMany(User, { through: Readinglist })

module.exports = {
    Blog, User, Readinglist
}