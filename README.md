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
distが作成される *distはフロントエンドで作成したsrcだったりの画面表示させるコードをコンパクトにまとめたやつてきな
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

コードスタイルに関するルールセットを定義するプラグインをインストール
npm install --save-dev @stylistic/eslint-plugin
プラグインプロパティを使用すると、ESLintのコアライブラリにはないカスタムルール、設定、その他の機能を追加することで、ESLintの機能を拡張できる
今回は、 ESLintにJavaScriptのスタイルルールを追加する@stylistic/eslint-pluginをインストール
index.jsのようなファイルの検査と検証は、以下のコマンドで行うことができます。
npx eslint index.js

リンティング用に別のnpmスクリプトを作成することをお勧めします。

---

設定ファイルのフォーマット
リンターの実行
スタイルルールの追加
演習問題3.22。
d

検証とESLint
アプリケーションのデータベースに保存されるデータには、通常、いくつかの制約を適用する必要があります。アプリケーションは、コンテンツプロパティが欠落している、または空であるメモを受け付けるべきではありません。メモの有効性は、ルートハンドラでチェックされます。

app.post('/api/notes', (request, response) => {
  const body = request.body
  if (!body.content) {
    return response.status(400).json({ error: 'content missing' })
  }

  // ...
})
コピー
メモにcontentプロパティがない場合、ステータスコード400 bad requestでリクエストに応答します。

データベースにデータを保存する前にデータの形式を検証するよりスマートな方法の1つは、Mongooseで利用できる検証機能を使用することです。

スキーマ内の各フィールドに対して、特定の検証ルールを定義できます。

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  important: Boolean
})
コピー
コンテンツフィールドは、最低5文字以上である必要があり、必須項目として設定されているため、欠落することはできません。重要なフィールドには制約を追加していないため、スキーマにおける定義は変更されていません。

minLengthとrequiredバリデーターはMongooseに組み込まれており、提供されています。Mongooseのカスタムバリデーター機能を使用すると、組み込みのバリデーターでニーズを満たせない場合に、新しいバリデーターを作成できます。

制約のいずれかに違反するオブジェクトをデータベースに保存しようとすると、操作は例外をスローします。新しいノートを作成するハンドラを変更して、発生する可能性のある例外をエラーハンドラミドルウェアに渡すようにしましょう。

app.post('/api/notes', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})
コピー
これらの検証エラーに対処するために、エラーハンドラを拡張しましょう。

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
コピー
オブジェクトの検証に失敗した場合、Mongoose から以下のデフォルトのエラーメッセージが返されます。

Postmanでエラーメッセージが表示される
データベースバックエンドを本番環境にデプロイする
アプリケーションはFly.io/Renderでほぼ現状のまま動作するはずです。これまでの変更はバックエンドのみなので、フロントエンドの新しい本番ビルドを生成する必要はありません。

dotenvで定義された環境変数は、バックエンドが本番モード（Fly.ioまたはRender）でない場合にのみ使用されます。

本番環境では、アプリをホストしているサービスにデータベースのURLを設定する必要があります。

Fly.ioでは、fly secrets set でそれを行います。

fly secrets set MONGODB_URI='mongodb+srv://fullstack:thepasswordishere@cluster0.a5qfl.mongodb.net/noteApp?retryWrites=true&w=majority'
コピー
アプリ開発中は、何らかの不具合が発生する可能性が非常に高い。例えば、データベースを使って初めてア​​プリをデプロイしたとき、エラーメッセージは一つも表示されなかった。

ブラウザにメモが表示されていない
ブラウザコンソールのネットワークタブを確認したところ、ノートの取得は成功せず、リクエストは長時間保留状態のままで、最終的にステータスコード502で失敗したことが分かりました。

ブラウザのコンソールは常に開いておく必要があります！

サーバーログを継続的に監視することも非常に重要です。問題は、 fly logsでログを開いたときに明らかになりました。

fly.ioサーバーログに「未定義に接続中」と表示
データベースのURLが未定義だったため、コマンド「fly secrets set MONGODB_URI」が実行されませんでした。

また、fly.ioアプリのIPアドレスをMongoDB Atlasのホワイトリストに登録する必要があります。登録しないと、MongoDBは接続を拒否します。

残念ながら、fly.io はアプリ専用の IPv4 アドレスを提供しないため、MongoDB Atlas ですべての IP アドレスを許可する必要があります。

Renderを使用する場合、データベースURLはダッシュボードで適切な環境を定義することで指定されます。

MONGODB_URI環境変数を表示するダッシュボードをレンダリングする
レンダリングダッシュボードには、サーバーログが表示されます。

ポート10000で実行中のサーバーを指す矢印付きのダッシュボードを表示する
現在使用しているアプリケーションのコード全体は、このGitHubリポジトリのpart3-6ブランチにあります。

練習問題3.19～3.21
3.19*: 電話帳データベース、ステップ7
検証条件を拡張し、データベースに保存される名前は少なくとも3文字以上でなければならないようにする。

フロントエンドを拡張して、検証エラーが発生した際に何らかのエラーメッセージを表示するようにします。エラー処理は、以下に示すようにcatchブロックを追加することで実装できます。

personService
    .create({ ... })
    .then(createdPerson => {
      // ...
    })
    .catch(error => {
      // this is the way to access the error message
      console.log(error.response.data.error)
    })
コピー
Mongooseが返すデフォルトのエラーメッセージは、必ずしも読みやすいとは言えませんが、表示することができます。

電話帳のスクリーンショットで、人物認証の失敗が表示されている
注：更新操作時、Mongooseのバリデーターはデフォルトで無効になっています。有効にする方法については、ドキュメントを参照してください。

3.20*: 電話帳データベース、ステップ8
電話帳アプリケーションに検証機能を追加して、電話番号が正しい形式であることを確認してください。電話番号は以下の条件を満たす必要があります。

長さが8以上
ハイフンで区切られた2つの部分から構成され、最初の部分は2つまたは3つの数字で構成され、2番目の部分も数字で構成されます。

例：09-1234556と040-22334455は有効な電話番号です
例：1234556、1-22334455、10-22-334455 は無効です
検証の2番目の部分を実装するには、カスタムバリデーターを使用します。

HTTP POSTリクエストで無効な電話番号を持つ人物を追加しようとした場合、サーバーは適切なステータスコードとエラーメッセージで応答する必要があります。

3.21 データベースバックエンドを本番環境にデプロイする
フロントエンドの新しい本番ビルドを作成し、それをバックエンドディレクトリにコピーして、アプリケーションの新しい「フルスタック」バージョンを生成します。http ://localhost:3001/ のアドレスからアプリケーション全体を使用して、ローカルですべてが正しく動作することを確認します。

最新バージョンをFly.io/Renderにプッシュし、そこでもすべてが正常に動作することを確認してください。

注：このパートのどの段階においても、フロントエンドを直接デプロイしてはいけません。このパート全体を通してデプロイされるのはバックエンドリポジトリのみです。フロントエンドのプロダクションビルドはバックエンドリポジトリに追加され、バックエンドは「バックエンドからの静的ファイルの提供」セクションで説明されているように、それを提供します。

糸くず
次のパートに進む前に、 lintと呼ばれる重要なツールについて見ていきましょう。Wikipedia では、lint について次のように説明しています。

一般的に、リンターとは、プログラミング言語におけるエラー（文体上のエラーを含む）を検出して警告するツール全般を指します。疑わしい言語使用箇所に警告を発するプロセスは、「リンターのような動作」と呼ばれることもあります。リンターのようなツールは、一般的にソースコードの静的解析を実行します。

Javaのようなコンパイル型静的型付け言語では、NetBeansなどのIDEは、コンパイルエラーだけでなく、コード内のエラーも指摘できます。checkstyleのような静的解析ツールを追加することで、 IDEの機能を拡張し、インデントなどのスタイルに関する問題も指摘できるようになります。

JavaScriptの世界では、現在、静的解析（別名「リンティング」）のための主要なツールはESLintです。

バックエンドの開発依存関係としてESLintを追加しましょう。開発依存関係とは、アプリケーションの開発中にのみ必要となるツールです。例えば、テスト関連のツールなどがこれに該当します。アプリケーションが本番環境で実行される際には、開発依存関係は必要ありません。

以下のコマンドを使用して、バックエンドの開発依存関係としてESLintをインストールします。

npm install eslint @eslint/js --save-dev
コピー
package.json ファイルの内容は、以下のように変更されます。

{
  //...
  "dependencies": {
    "dotenv": "^16.4.7",
    "express": "^5.1.0",
    "mongoose": "^8.11.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.22.0",
    "eslint": "^9.22.0"
  }
}
コピー
このコマンドは、ファイルにdevDependenciesセクションを追加し、 eslintと@eslint/jsパッケージを含め、必要なライブラリをnode_modulesディレクトリにインストールしました。

この後、以下のコマンドでデフォルトのESLint設定を初期化できます。

npx eslint --init
コピー
すべての質問にお答えします。

ESLint init のターミナル出力
設定内容は、生成されたeslint.config.mjsファイルに保存されます。

設定ファイルのフォーマット
設定ファイルeslint.config.mjsを現在の形式から以下のように書き換えましょう。

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
コピー
これまでのところ、ESLintの設定ファイルでは、filesオプションを["**/*.js"]と定義しており、ESLintにプロジェクトフォルダ内のすべてのJavaScriptファイルを参照するように指示しています。languageOptionsプロパティは、ESLintが想定する言語機能に関連するオプションを指定しており、sourceTypeオプションを"commonjs"と定義しています。これは、プロジェクト内のJavaScriptコードがCommonJSモジュールシステムを使用していることを示しており、ESLintがそれに応じてコードを解析できるようになります。

globalsプロパティは、事前に定義されたグローバル変数を指定します。ここで適用されているスプレッド演算子は、processなどglobals.node設定で定義されているすべてのグローバル変数を ESLint に含めるように指示します。ブラウザ コードの場合は、windowやdocumentなどのブラウザ固有のグローバル変数を許可するために、ここでglobals.browserを定義します。

最後に、ecmaVersionプロパティを「latest」に設定します。これにより、ECMAScript のバージョンが利用可能な最新バージョンに設定され、ESLint が最新の JavaScript 構文と機能を正しく理解し、適切にリンティングできるようになります。

ESLintの推奨設定と独自の設定を併用したいと考えています。以前インストールした@eslint/jsパッケージには、ESLint用の事前定義済み設定が含まれています。これをインポートして、設定ファイルで有効にします。

import globals from 'globals'
import js from '@eslint/js'
// ...

export default [
  js.configs.recommended,
  {
    // ...
  },
]
コピー
設定配列の先頭にjs.configs.recommendedを追加しました。これにより、ESLintの推奨設定が、独自のカスタムオプションよりも先に適用されるようになります。

設定ファイルの作成を続けましょう。コードスタイルに関するルールセットを定義するプラグインをインストールします。

npm install --save-dev @stylistic/eslint-plugin
コピー
プラグインをインポートして有効化し、以下の4つのコードスタイルルールを追加してください。

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
コピー
プラグインプロパティを使用すると、ESLintのコアライブラリにはないカスタムルール、設定、その他の機能を追加することで、ESLintの機能を拡張できます。今回は、 ESLintにJavaScriptのスタイルルールを追加する@stylistic/eslint-pluginをインストールして有効化しました。さらに、インデント、改行、引用符、セミコロンのルールも追加されています。これらの4つのルールはすべてESLintスタイルプラグインで定義されています。

Windows ユーザーへの注意:スタイルルールでは、改行スタイルがunixに設定されています。ほとんどの最新のオペレーティングシステムと互換性があり、複数のユーザーが同じファイルで作業する場合のコラボレーションを容易にするため、オペレーティングシステムに関係なくUnix スタイルの改行 ( \n ) を使用することをお勧めします。Windows スタイルの改行を使用している場合、ESLint は次のエラーを生成します:改行は 'LF' である必要がありましたが、'CRLF' が見つかりました。この場合は、このガイドに従って Visual Studio Code を構成して Unix スタイルの改行を使用してください。

リンターの実行
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
