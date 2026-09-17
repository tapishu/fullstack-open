# fullstack-open
Learning fullstack

Command

Create Frontend Base by Vite(開発ツール)
npm create vite@latest

Open Project:
npm run dev

Install axios:
npm install axios

Install json server?
npm install json-server --save-dev
And add ["server": "json-server -p 3001 db.json"] to "scrips" on package.json 
npm run server 


part3 Backend

Create project
npm init
package.jsonに以下を挿入
"scripts": {
    "start": "node index.js",
  },

index.jsファイルの作成
touch index.js

実行方法
node index.js　
もしくは
npm start

expressのインストール
npm install express
npm update
その後
const express = require('express')
const app = express()
をコードに入力

自動変更追跡(サーバーを逐一再起動しなくていいように)
node --watch index.js
もしくはpackage.jsonに以下を挿入
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
その後
npm run dev

Visual Studio Code RESTクライアント
アプリケーションのルートディレクトリに「 requests」という名前のディレクトリを作成します。
すべてのRESTクライアントリクエストを、拡張子「.rest」が付いたファイルとしてそのディレクトリに保存します。

ミドルウェアの使用
app.use(express.json())
app.use(requestLogger)

アプリケーションにログ記録用のミドルウェア「morgan」
npm install morgan
以下で関数を指定し
morgan.token("body",(request) => { //bodyというトークン（変数を定義）
    return JSON.stringify(request.body) //POSTなどのbody付きリクエストが来るたびに呼ばれる。request.bodyを文字列化
})
呼び出し方法
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body') //:がついているのは全て変数
)

corsのインストール方法
npm install cors
設定と使用方法
const cors = require('cors')
app.use(cors())
ポートの設定
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

・Renderの設定方法
Create Web Service
Public git repository 
→ GITにアップロードしたURLを入力 https://github.com/tapishu/fullstack-open
基本設定を入力
正しい設定値
Root directory: part3/Practice
Build Command: npm install
Start Command: npm start

フロントエンド側でnote.jsの参照URLの変更
//const baseUrl = "http://localhost:3001/notes";
const baseUrl = "/api/notes";
コード圧縮用のファイルを作成するためにbuildを実行
npm run build
distが作成される
今回は一つのサーバーにフロントエンドとバックエンドをまとめる
このdistをバックエンドのルートディレクトリに保存
バックエンドのindex.jsに
app.use(express.static('dist'))を追加
*「Express（バックエンド）に、dist フォルダの中身（HTML/CSS/JSなどの静的ファイル）をWebページとしてそのまま外部に見せて（配信して）いいよ！」 と許可を与える設定です。


フロントエンドのデプロイ
バックエンド側のpackage.jsonファイルの編集
{
  "scripts": {
    //...
        //古いdistを消して。フロントエンド側のルートディレクトリに移動し、buildを実行してdistをバックエンドのルートディレクトリに再起的にコピーしている？ 
    "build:ui": "rm -rf dist && cd ../part2 && npm run build && cp -r dist ../part3",
    "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push"
  }
}

プロキシ
開発モードではフロントエンドがlocalhost:5173のアドレスにあるため、バックエンドへのリクエストは誤ったアドレスlocalhost:5173/api/notesに送信されます。バックエンドはlocalhost:3001にあります。
プロジェクトがViteで作成されている場合、この問題は簡単に解決できます。frontendディレクトリのvite.config.jsファイルに以下の宣言を追加するだけで十分です。
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    }
  },
})
