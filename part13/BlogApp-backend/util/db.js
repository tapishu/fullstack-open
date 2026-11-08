const Sequelize = require('sequelize')
const { DATABASE_URL,TEST_DATABASE_URL } = require('./config')
const { Umzug, SequelizeStorage } = require('umzug')
const url = process.env.TESTING === 'true' ? TEST_DATABASE_URL : DATABASE_URL

const sequelize = new Sequelize(url, {
  // dialectOptions: {
  //   ssl: {
  //     require: true,
  //     rejectUnauthorized: false
  //   }
  // },
}); 

const migrationConf = {
  migrations: {
    glob: 'migrations/*.js',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
}

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf)
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}
const rollbackMigration = async () => {
  await sequelize.authenticate() //データベースにちゃんと接続できるか？」を確認
  const migrator = new Umzug(migrationConf)
  await migrator.down()
}

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
            await runMigrations()
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database')
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize,rollbackMigration }
