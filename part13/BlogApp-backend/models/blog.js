const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')


//モデルの定義.class Blog にすることでBlog.findAll() などの便利なメソッドが使えるようになります。
class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT,
  },
  url: { //大文字のURLにすると下記のunderscoredで勝手に小文字に直される
    type: DataTypes.TEXT,
    allowNull: false,
    // field: 'url' // ← データベース上の実際の列名（大文字の 'URL'）をここに明示する！
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  year:{
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args:[1991],
msg: "Year must be 1991 or later"
      },
      max:{
args: [new Date().getFullYear()],
msg: `Year cannot be greater than the current year (${new Date().getFullYear()})`
      }
    }
  },
  created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
}, {//以下はデータベースと結びつけるためのオプション設定
  sequelize, //どのデータベース接続を使ってこのモデルを管理するか
  underscored: true,
  //データベース側の列（カラム）名を自動的に「スネークケース（単語と単語をアンダースコア _ でつなぐ書き方）」にする設定です
  //例: JavaScript側で userId と書いた場合、自動的にデータベース側では user_id という列名として扱われます。
  timestamps: false,
  //テーブルに自動で追加される createdAt（作成日時） と updatedAt（更新日時） という2つの列を自動生成する機能をオフ（無効）にしています。
  //今回自分で date time という列を作ったため、Sequelizeが自動で付与する日時管理機能が不要な場合に false にします。
  modelName: 'blog'
  //'blog': このモデルの名前を登録しています。これによって、Sequelizeが自動的にデータベース上のテーブル名を小文字の複数形である blogs として認識・管理してくれます。
})

module.exports = Blog
