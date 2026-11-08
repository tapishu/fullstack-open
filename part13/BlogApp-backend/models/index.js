const Blog = require('./blog')
const User = require('./user')
const Reading_lists = require('./reading_list')
const Session = require('./session')

User.hasMany(Blog)
Blog.belongsTo(User) //テーブルが存在しなければ実行される
User.hasMany(Session)
Session.belongsTo(User)

User.belongsToMany(Blog, { through: Reading_lists, as: 'readings' })
Blog.belongsToMany(User, { through: Reading_lists, as: 'reading_users' })

// const syncModels = async () => {
//   await User.sync({ alter: true })
//   await Blog.sync({ alter: true })
// }

// syncModels()

module.exports = {
  Blog,User,Reading_lists,Session
}
