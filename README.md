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
