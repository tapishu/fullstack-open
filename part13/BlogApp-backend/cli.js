require('dotenv').config()
const { Sequelize, Model, DataTypes,QueryTypes } = require('sequelize')
const express = require('express')
const app = express()

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  // dialectOptions: {
  //   ssl: {
  //     require: true,
  //     rejectUnauthorized: false
  //   }
  // },
});


// class Note extends Model {}
// Note.init({
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   content: {
//     type: DataTypes.TEXT,
//     allowNull: false
//   },
//   important: {
//     type: DataTypes.BOOLEAN
//   },
//   date: {
//     type: DataTypes.DATE
//   }
// }, {
//   sequelize,
//   underscored: true,
//   //データベース側の列（カラム）名を自動的に「スネークケース（単語と単語をアンダースコア _ でつなぐ書き方）」にする設定です
//   //例: JavaScript側で userId と書いた場合、自動的にデータベース側では user_id という列名として扱われます。
//   timestamps: false,
//   //テーブルに自動で追加される createdAt（作成日時） と updatedAt（更新日時） という2つの列を自動生成する機能をオフ（無効）にしています。
//   //今回自分で date time という列を作ったため、Sequelizeが自動で付与する日時管理機能が不要な場合に false にします。
//   modelName: 'note'
// })

const main = async () => {
  try {
    await sequelize.authenticate()
    const notes = await sequelize.query("SELECT * FROM blogs", { type: QueryTypes.SELECT })    
    console.log(notes)    
    sequelize.close()  
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}
main()