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
＊開発中（ローカル環境）では、フロントエンドとバックエンド(port 3001)が異なるドメイン（ポート番号）で動いていたため、ブラウザのセキュリティ機能により異なるポート間の通信は拒否される。corsを用いてフロントエンド側のアクセス(localhost:5173)を許可するように設定
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
これによりdistが作成される *distはフロントエンドで作成したsrcだったりの画面表示させるコードをコンパクトにまとめたやつてきな
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
開発モードではフロントエンドがlocalhost:5173のアドレスにあるため、バックエンドへのリクエストは誤ったアドレスlocalhost:5173/api/notesに送信されます。バックエンドはlocalhost:3001にあります。開発モードのときだけ、Vite に「/api から始まるリクエストが来たら、バックエンド（http://localhost:3001）に自動で転送（代理送信）してね」と教え込む仕組みが プロキシ です。
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

・Part3 C.データをMongoDBに保存する

Mongo DB の作成
deploy your cluster
クラウドサービスプロバイダや名前の選択
Securityから編集用ユーザーの作成

ネットワークアクセスの設定
0.0.0.0/0

clustorのconnectの画面よりコネクト用コードの確認

Mongooseはオブジェクトドキュメントマッパー（ODM）と表現でき、
このライブラリを使えばJavaScriptオブジェクトをMongoDBドキュメントとして保存するのは簡単です。
npm install mongoose


mongo.jsを作り内容を編集（テスト用）
node mongo.js yourPassword
で実行

*一部mongo.js抜粋
const url = `mongodb+srv://fullstack:${password}@fullstack.adeo6hc.mongodb.net/noteApp?retryWrites=true&w=majority&appName=fullstack`
//接続先://ユーザー名:パスワード@接続先コード/DB名(noteApp)?(接続先オプション)&接続先コードの続き(appName=fullstack)


dotenvライブラリを使用して環境変数を定義する
npm install dotenv
ライブラリを使用するには、プロジェクトのルートディレクトリに.envファイルを作成します。
環境変数はこのファイル内で定義され、以下のような内容になります。
MONGODB_URI=mongodb+srv://fullstack:thepasswordishere@cluster0.a5qfl.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0
PORT=3001


解析ツールLint
npm install eslint @eslint/js --save-dev
以下のコマンドでデフォルトのESLint設定
npx eslint --init

設定ファイルeslint.config.mjsを現在の形式から以下のように書き換えましょう。
----
import globals from 'globals'

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
      ecmaVersion: 'latest',
    },
  },
]
----
ESLintの推奨設定と独自の設定を併用したいと考えています。以前インストールした@eslint/jsパッケージには、ESLint用の事前定義済み設定が含まれています。これをインポートして、設定ファイルで有効にします。
---
import globals from 'globals'
import js from '@eslint/js'
// ...

export default [
  js.configs.recommended,
  {
    // ...
  },
---
コードスタイルに関するルールセットを定義するプラグインをインストール
npm install --save-dev @stylistic/eslint-plugin
プラグインをインポートして有効化し、以下の4つのコードスタイルルールを追加してください。
---
import globals from 'globals'
import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin'

export default [
  {
    // ...

    plugins: { 
      '@stylistic/js': stylisticJs,
    },
    rules: { 
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
    }, 
  },
]
---
プラグインプロパティを使用すると、ESLintのコアライブラリにはないカスタムルール、設定、その他の機能を追加することで、ESLintの機能を拡張できる
今回は、 ESLintにJavaScriptのスタイルルールを追加する@stylistic/eslint-pluginをインストール


index.jsのようなファイルの検査と検証は、以下のコマンドで行うことができます。
npx eslint index.js

リンティング用に別のnpmスクリプトを作成することをお勧めします。
---
{
  // ...
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js",
    "test": "echo \"Error: no test specified\" && exit 1",
    "lint": "eslint ."
---
これで、`npm run lint`コマンドはプロジェクト内のすべてのファイルをチェックするようになります。
VS CodeのESLintプラグインは、スタイル違反箇所を赤い線で下線表示しますもおすすめ

コマンド実行時には、 distディレクトリ内のファイルもチェックされます。これは望ましくないため、無視したいディレクトリとファイルの配列を指定するignoresプロパティを持つオブジェクトを追加することで実現できます。
---
export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    // ...
  },
  { 
    ignores: ['dist/**'], 
  },
]
---

等号のチェックにトリプルイコール演算子以外のものが使用された場合に警告を発するeqeqeqルールを追加しましょう。このルールは、設定ファイルのrulesフィールドに追加します。
---
export default [
  // ...
  rules: {
    // ...
   eqeqeq: 'error',
  },
  // ...
]
---

行末に不要な空白が入らないようにし、波括弧の前後に必ず空白を入れるようにし、さらに矢印関数の関数パラメータにおける空白の使い方も一貫して行うように要求しましょう。
---
export default [
  // ...
  rules: {
    // ...
    eqeqeq: 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': ['error', 'always'],
    'arrow-spacing': ['error', { before: true, after: true }],
  },
]
---
console.logコマンドについて警告するルールが含まれています。ルールを無効にするには、設定ファイルでその「値」を 0 またはoffに定義します。とりあえず、no-consoleルールに対してこの設定を行いましょう。
---
    rules: {
      // ...
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 'off',
---
no-consoleルールを無効にすることで、ESLintが問題としてフラグを立てることなくconsole.log文を使用できるようになります。
