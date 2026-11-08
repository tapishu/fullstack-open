const { DataTypes } = require('sequelize')

module.exports = {
    //1. up（データベースを新しく構築・更新するとき）
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: {
msg: "username must be a valid email address" 
      }
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  }, //データベース上でハッシュかされたパスワードの保存
  created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    })

    await queryInterface.createTable('blogs', {
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
  user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
  created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    })
  },
  //2. down（変更を元に戻す / ロールバックするとき）
  //何らかの理由で「このマイグレーションをやっぱり取り消したい（やり直したい）」というときに動く処理です。作成したテーブルを逆順で安全に削除（破棄）します：
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('blogs')
    await queryInterface.dropTable('users')
  },
}