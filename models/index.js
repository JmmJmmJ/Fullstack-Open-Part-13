const Blog = require('./blog')
const User = require('./user')
const Readinglist = require('./readinglist')
const Membership = require('./membership')

User.hasMany(Blog)
Blog.belongsTo(User)

User.hasOne(Readinglist)
Readinglist.belongsTo(User)

Blog.belongsToMany(Readinglist, { through: Membership} )
Readinglist.belongsToMany(Blog, { through: Membership} )

module.exports = {
    Blog, User, Readinglist, Membership
}