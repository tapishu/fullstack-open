# fullstack-open
Learning fullstack

Command

Create Frontend Base by Vite(開発ツール)
npm create vite@latest

Open Project:
npm run dev

Install axios:ブラウザや Node.js から Web サーバーと通信（HTTP リクエスト）を行うための JavaScript ライブラリ
npm install axios

Install json server?
npm install json-server --save-dev
And add ["server": "json-server -p 3001 db.json"] to "scrips" on package.json 
npm run server 


part3 Backend

Create project
シンプルなバックエンド（Node.js/Express）や、プレーンな JavaScript ライブラリを作る
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


Part4
データベースをモックしてバックエンドテストを実装することが有益な場合があります。これに使用できるライブラリの1つにmongodb-memory-server

テスト実行時にNODE_ENVにtestという値を取得するように、ノートアプリケーションのpackage.jsonファイル内のスクリプトを変更
{
  // ...
  "scripts": {
    "start": "NODE_ENV=production node index.js",
    "dev": "NODE_ENV=development node --watch index.js",
    "test": "NODE_ENV=test node --test",
    "lint": "eslint ."
  }
  // ...
}

プロジェクトの依存関係としてcross-envパッケージをインストールすることで、この問題を解決できます。
npm install cross-env

  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development node --watch index.js",
    "test": "cross-env  NODE_ENV=test node --test",
    "lint": "eslint ."
  },
  // ...

  utils/config.jsへの変更
  const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI


  envファイルには、開発用データベースとテスト用データベースのデータベース アドレスを表す個別の変数が含まれています。
  takahashishuuta@MacBookAir part4 % cat .env
MONGODB_URI=mongodb+srv://fullstack:Shutapioca0821@fullstack.adeo6hc.mongodb.net/noteApp?retryWrites=true&w=majority&appName=fullstack
PORT=3001
TEST_MONGODB_URI=mongodb+srv://fullstack:Shutapioca0821@fullstack.adeo6hc.mongodb.net/testNoteApp?retryWrites=true&w=majority&appName=fullstack

スーパーテスト
APIをテストするためのテストを作成するのに、supertestパッケージを利用
npm install --save-dev supertest


ユーザーの作成
パスワードハッシュを生成するために、bcryptパッケージをインストール
npm install bcrypt

JSON Webトークンを生成できるjsonwebtokenライブラリをインストール
npm install jsonwebtoken


Part5
Vitestとウェブブラウザをシミュレートするjsdomライブラリをインストールしましょう。
npm install --save-dev vitest jsdom
Vitestに加えて、テスト目的でコンポーネントをレンダリングするのに役立つ別のテストライブラリも必要です。現在、このための最良の選択肢は、近年急速に人気が高まっているreact-testing-libraryです。また、jest-domライブラリを使用してテストの表現力を拡張することも検討する価値があります。
npm install --save-dev @testing-library/react @testing-library/jest-dom

jsonファイルへの追記
  "scripts": {
    // ...
    "test": "vitest run"
  }
  // ...

  プロジェクトルートに以下の内容のファイルtestSetup.jsを作成しましょう。
----
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
})
----
vite.config.jsファイルを以下のように展開します。
export default defineConfig({
  // ...
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './testSetup.js', 
  }
})


ユーザー入力のシミュレーションを少し簡単にするライブラリ「user-event」をインストールしてみましょう。
npm install --save-dev @testing-library/user-event

以下のコマンドでテストを実行することで、テストのカバレッジを簡単に確認できます。
npm test -- --coverage


テストを初期化しています
バックエンドテストやReactフロントエンドで行うユニットテストとは異なり、エンドツーエンドテストはコードと同じnpmプロジェクトに配置する必要はありません。npm initコマンドを使用して、E2Eテスト専用のプロジェクトを完全に別個に作成しましょう。次に、新しいプロジェクトディレクトリで以下のコマンドを実行してPlaywrightをインストールします。
npm init playwright@latest

package.jsonに、テストとテストレポートを実行するための npm スクリプトを定義しましょう。

{
  // ...
  "scripts": {
    "test": "playwright test",
    "test:report": "playwright show-report"
  },
  // ...
}

テストのレポート
npm run test:report
 npm test -- --ui

使用するブラウザエンジンは、コマンドラインパラメータで指定できます。
npm test -- --project chromium


テストを開発する際には、待機時間を数秒に短縮する方が賢明な場合があります。ドキュメントによると、これはplaywright.config.jsファイルを以下のように変更することで実現できます。

export default defineConfig({
  // ...
  timeout: 3000,
  fullyParallel: false,
  workers: 1,
  // ...
})


実際にバックエンド側でテストを行うためにpackage.jsonにテストスクリプトを記載
    "start:test": "cross-env NODE_ENV=test node --watch index.js"

React Routerをインストールする：

npm install react-router-dom

useMatch() が <App> の直下で動くためには、<App/> 全体が <Router> (BrowserRouter) の内側 でレンダリングされている必要があります。

現在、main.jsx（または index.js）側で <App/> が <Router> で囲まれていないことが原因です。


IUフレームワーク
リMaterialUIを見てみましょう。これは、GoogleのMaterial Designデザイン言語を実装したものです。

ライブラリをインストールしましょう。

npm install @mui/material @emotion/react @emotion/styled


これまで見てきた方法に加えて、Reactアプリにスタイルを適用する方法は他にもあります。

ES6のタグ付きテンプレートリテラル構文を利用するstyled -componentsライブラリは、スタイルを定義するための興味深いアプローチを提供します。

styled-componentsをインストールして、メモアプリ（MaterialUIをインストールする前のバージョン）にいくつかのスタイル変更を加えてみましょう。まず、使用するコンポーネントのスタイル定義を2つ作成します。
npm install styled-components


Part6

新しいViteアプリケーションを作成し、Zustandをインストールします。
npm install zustand

useNotesに もかなりの量のロジックが含まれているため、テストはReact Testing Libraryのフックを含むモジュール
npm install --save-dev vitest @testing-library/react jsdom

テスト環境の設定を vite.config.jsに追加しましょう。
  test: {
    environment: 'jsdom',
  },

テストの実行は
 npx vitest run


TanStackクエリライブラリを使用したサーバー上のデータ管理
それでは、  TanStackクエリを使用します。（新しいタブで開きます） サーバーから取得したデータを保存および管理するためのライブラリ。
npm install @tanstack/react-query
 ライブラリ関数をアプリケーション全体に渡すには、main.jsxファイルにいくつかの変更を加える 必要があります
 ------------------------
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import App from './App.jsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)
 ------------------------


ESLint が「コードの書き方ルールチェック（バグになりそうな変数の未定義や構文ミス）」をするのに対して、Prettier は「見た目の統一（シングルクォートにするか、セミコロンをつけるか、インデントの調整など）」を保存時に自動で綺麗にしてくれるツールです。
ターミナルでフロントエンド（またはプロジェクトのルート）ディレクトリで以下インストール
npm install --save-dev prettier

プロジェクトのルートディレクトリに .prettierrc という名前のファイルを作成し、プロジェクトのフォーマットルールを記述します。
    {
      "semi": false,
      "singleQuote": true,
      "tabWidth": 2,
      "trailingComma": "es5"
    }

コマンド実行例
npx prettier --write .

エディタ（VS Code）で保存時に自動実行させる設定
エディタ側でファイル保存時（Cmd + S / Ctrl + S）に自動で整形されるように設定します。
拡張機能をインストール:
VS Code の拡張機能タブで Prettier - Code formatter を検索してインストールします。
VS Code の設定を更新:
.vscode/settings.json（プロジェクト内、なければ作成）に以下を追加するか、VS Code の設定画面から有効化します。

{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}


Part8
アポロサーバー
今日の主要ライブラリであるApollo Serverを使ってGraphQLサーバーを実装してみましょう。 （新しいタブで開きます）。
新しい npm プロジェクトを作成し npm init 、必要な依存関係をインストールします。
npm install @apollo/server graphql

index.js プロジェクトのルートディレクトリにもファイルを作成してください 。
----------
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

let persons = [
  {
    name: "Arto Hellas",
    phone: "040-123543",
    street: "Tapiolankatu 5 A",
    city: "Espoo",
    id: "3d594650-3436-11e9-bc57-8b80ba54c431"
  },
  {
    name: "Matti Luukkainen",
    phone: "040-432342",
    street: "Malminkaari 10 A",
    city: "Helsinki",
    id: '3d599470-3436-11e9-bc57-8b80ba54c431'
  },
  {
    name: "Venla Ruuska",
    street: "Nallemäentie 22 C",
    city: "Helsinki",
    id: '3d599471-3436-11e9-bc57-8b80ba54c431'
  },
]

const typeDefs = `
  type Person {
    name: String!
    phone: String
    street: String!
    city: String! 
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons: [Person!]!
    findPerson(name: String!): Person
  }
`

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) =>
      persons.find(p => p.name === args.name)
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
----------

 アプリケーションを実行するために、以下のスクリプトを package.jsonに追加しましょう。
 ----------
 {
  //...
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js",
    // ...
  }
}
 ----------

-----
「GraphQLの強力なクエリやデータ構造を、バグを出さずに効率よくフロントエンドで扱うための『至れり尽くせりの専用お助けセット』」がApolloです。これがあるおかげで、通信の細かいお世話を気にせず、UIの構築やビジネスロジックに集中できるようになります！

 REST APIの特徴：
リソースごとにURLが分かれている（例: ノート一覧は /api/notes、ユーザーは /api/users）。
HTTPメソッド（GET, POST, PUT, DELETE）をそのまま使ってシンプルにデータの取得や保存を行う。

Axiosやfetchが合う理由：
「このURLにデータをPOSTする」「このURLからGETで取ってくる」という構造がシンプルなため、Axiosや fetch のような直接的なHTTPクライアントを使うのが一番ストレートで分かりやすいからです。
-----

新しいReactアプリを作成し、  Apolloクライアントに必要な依存関係をインストールしましょう。（新しいタブで開きます）。

npm install @apollo/client graphql

main.jsxファイルのデフォルトの内容を
--
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import { ApolloClient, gql, HttpLink, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4000',
  }),
  cache: new InMemoryCache(),
})

const query = gql`
  query {
    allPersons {
      name
      phone
      address {
        street
        city
      }
      id
    }
  }
`

client.query({ query }).then((response) => {
  console.log(response.data)
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
--

ExpressとApollo Server統合パッケージをインストールしましょう。
npm install express cors @as-integrations/express5
server.js ファイルを以下の形式に変更してください 。
---------------
const { ApolloServer } = require('@apollo/server')
const {
  ApolloServerPluginDrainHttpServer,
} = require('@apollo/server/plugin/drainHttpServer')
const { expressMiddleware } = require('@as-integrations/express5')
const cors = require('cors')
const express = require('express')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const http = require('http')
const jwt = require('jsonwebtoken')

const resolvers = require('./resolvers')
const typeDefs = require('./schema')
const User = require('./models/user')

const getUserFromAuthHeader = async (auth) => {
  if (!auth || !auth.startsWith('Bearer ')) {
    return null
  }

  const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
  return User.findById(decodedToken.id).populate('friends')
}

const startServer = async (port) => {
  const app = express()
  const httpServer = http.createServer(app)
 
  const server = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })
 
  await server.start()
 
  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req.headers.authorization
        const currentUser = await getUserFromAuthHeader(auth)
        return { currentUser }
      },
    }),
  )
 
  httpServer.listen(port, () =>
    console.log(`Server is now running on http://localhost:${port}`),
  )
}

module.exports = startServer
---------------
バックエンドのサブスクリプション
GraphQLへのサブスクリプションを追加するためのパッケージと、Node.jsのWebSocketライブラリをインストールする必要があります。
npm install graphql-ws ws @graphql-tools/schema

server.jsというファイル  が以下のように変更されました。

---------
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/use/ws')

// ...

const startServer = async (port) => {
  const app = express()
  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })
 
  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema, 
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          }
        },
      },
    ],
  })

  await server.start()

  // ...
}
---------

まず、パブリッシュ/サブスクライブ機能を提供するライブラリをインストールしましょう
npm install graphql-subscriptions

resolvers.jsファイルへの変更点  は以下のとおりです。
-------------
const { GraphQLError } = require('graphql')
const { PubSub } = require('graphql-subscriptions')
const jwt = require('jsonwebtoken')

const Person = require('./models/person')
const User = require('./models/user')

const pubsub = new PubSub()

const resolvers = {
  // ...
  Mutation: {
    addPerson: async (root, args, context) => {
        const currentUser = context.currentUser

        if (!currentUser) {
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
            },
          })
        }

        const nameExists = await Person.exists({ name: args.name })

        if (nameExists) {
          throw new GraphQLError(`Name must be unique: ${args.name}`, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
            },
          })
        }

      const person = new Person({ ...args })

      try {
        await person.save()
        currentUser.friends = currentUser.friends.concat(person)
        await currentUser.save()
      } catch (error) {
        throw new GraphQLError(`Saving person failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }


      pubsub.publish('PERSON_ADDED', { personAdded: person })

      return person
    },
    // ...
  },
  Subscription: {
    personAdded: {
      subscribe: () => pubsub.asyncIterableIterator('PERSON_ADDED')
    },
  },
}
-------------

クライアントのサブスクリプション

graphql-wsライブラリをフロントエンドの依存関係として追加しましょう  。これにより、   GraphQLサブスクリプションのためのWebSocket接続が可能
npm install graphql-ws

main.jsxの設定を  以下のように変更する必要があります。
--------------------------
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { SetContextLink } from '@apollo/client/link/context'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'

const authLink = new SetContextLink(({ headers }) => {
  const token = localStorage.getItem('phonebook-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  }
})

const httpLink = new HttpLink({ uri: 'http://localhost:4000' })

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000',
  }),
)

const splitLink = ApolloLink.split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink),
)

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)
--------------------------

queriesにサブスクリプションを足す


TypeScript
npm init空のディレクトリでコマンドを実行することで設定されます。その後、以下のコマンドを実行することで依存関係をインストールできます。
npm install --save-dev typescript

package.jsonファイル内にスクリプトも設定しましょう。
--------------
{
  // ...
  "type": "module",
  "scripts": {
   "tsc": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.9.3"
  }
}
--------------

npm run tsc file.ts
--noEmit オプションは、TypeScript コンパイラに JavaScript 出力を生成しないように指示します。コンパイル済みファイルは生成されず、型チェックのみが実行されます。

 プロジェクトに以下の内容の構成ファイル tsconfig.jsonを追加しましょう。
------------
{
  "compilerOptions":{
    "noImplicitAny": false,
    "noEmit": true
  }
}
------------
tsconfig.jsonファイルは、TypeScript コンパイラがコードをどのように解釈するか、コンパイラの動作の厳密さ、監視または無視するファイルなどを定義するために使用されます。今のところは、コンパイラオプションnoImplicitAnyを無効にするだけにします。（新しいタブで開きます）そのため、使用するすべての変数に型を付ける必要はありません。また、TypeScriptコンパイラはチェックのみに使用するため、「noEmit」をtrueに設定しました。
   "tsc": "tsc"

パッケージ@types/nodeがインストールされている場合、コンパイラは変数 process についてエラーを出力しません。コード内で型を require する必要はなく、パッケージをインストールするだけで十分です。
npm install --save-dev @types/node
以下をtsconfig.jsonに足す
"types": ["node"]


Expressも加えて
その前に、 tsconfig.jsonファイルの設定を少し拡張してみましょう。今のところ、このファイルにはnoImplicitAny というtsconfig ルールが 1 つしかありません。（新しいタブで開きます）ファイルの内容を変更して、以下の内容にしてください。
{
  "compilerOptions": {
    "target": "esnext",
    "noEmit": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "module": "nodenext",
    "esModuleInterop": true,
    "allowImportingTsExtensions": true
  }
}

npm install express

そして、   package.jsonにスタートスクリプトを追加します。

{
  // ...
  "scripts": {
    "tsc": "tsc",
    "multiply": "tsc  && node multiplier.ts",
    "start": "tsc && node index.ts"
  },
  // ..
}

これで、 index.tsファイルを作成し 、HTTP GET  ping エンドポイントをそこに書き込むことができます。
const express = require('express');
const app = express();

app.get('/ping', (req, res) => {
  res.send('pong');
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

エラーの原因は、Expressの型がインストールされていないことです。提案に従って、以下を実行してください。
npm install --save-dev @types/express

これは、 tsconfig.jsonで未使用のパラメータを禁止したためです 。

しかし、これは完全にはうまくいきません。型チェックは最初にしか行われないからです。解決策の一つは、型チェックとNodeをウォッチモードで同時に実行することです。これはnpmパッケージのconcurrentlyを使えば簡単にできます。それでは、インストールしてみましょう。

npm install --save-dev concurrently
package.jsonにスクリプトを追加します 。


  "scripts": {
    "tsc": "tsc",
    "multiply": "tsc && node multiplier.ts",
    "calculate": "tsc && node calculator.ts",
    "start": "node index.ts",
    "dev": "concurrently \"tsc --watch\" \"node --watch index.ts\""
  },

ESlint
開発者が任意の型を使用できないように制限したい場合はどうすればよいでしょうか ？幸いなことに、コーディングスタイルを強制するにはtsconfig.json 以外の方法もあります 。ESlintを 使用してコードを管理することができます  。ESlintとそのTypeScript拡張機能をインストールしましょう。
新しいバージョンがリリースされるまでは、コマンドを次の形式で実行する必要があります。 npm install --legacy-peer-deps
npm install --save-dev eslint @eslint/js typescript-eslint
npm install --legacy-peer-deps eslint @eslint/js typescript-eslint
ESlint を設定して 明示的な any を禁止します（新しいタブで開きます）eslint.config.mjsに以下のルールを記述してください 。
------
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  files: ['**/*.ts'],
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
  },
});
------

package.jsonファイル を変更してファイルを検査する lint npm スクリプトも設定しましょう  。
---
{
  // ...
  "scripts": {
      "tsc": "tsc",
      "calculate": "tsc && node calculator.ts",
      "multiply": "tsc && node multiplier.ts",
      "start": "node index.ts",
      "dev": "concurrently \"tsc --watch\" \"node --watch index.ts\"",
      "lint": "eslint ."
      //  ...
  },
  // ...
}
---

推奨設定に加えて、この部分で求められるコーディングスタイルに慣れ、 各コード行の末尾にセミコロンを必須とするように設定する必要があります。そのためには、 @stylistic/eslint-pluginをインストールして設定する必要があります。 （新しいタブで開きます）:
npm install --save-dev @stylistic/eslint-plugin
npm install --legacy-peer-deps @stylistic/eslint-plugin
最終的な eslint.config.mjs は以下のようになります。
----
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from "@stylistic/eslint-plugin";

export default tseslint.config({
  files: ['**/*.ts'],
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  plugins: {
    "@stylistic": stylistic,
  },
  rules: {
    '@stylistic/semi': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { 'argsIgnorePattern': '^_' }
    ],
  },
});
----

Expressアプリで入力
 npm init を実行して 、  typescript パッケージを開発依存関係としてインストールします。
  npm install typescript --save-dev
package.jsonにも必要な変更を加えましょう。
---
{
  // ..
  "type": "module",
  "scripts": {
    "tsc": "tsc"  
  },
  // ..
}
---
これで、以下のコマンドを実行してtsconfig.jsonの設定を初期化できます。
 npm run tsc -- --init

tsconfig.jsonファイルの設定
------------
{
  "compilerOptions": {
    "target": "esnext",
    "noEmit": true,
    "module": "nodenext",
    "esModuleInterop": true,
    "allowImportingTsExtensions": true,
    "strict" : true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
------------
設定が完了したので、次は express と、もちろん @types/expressをインストールします。また、これは将来的に拡張していくことを想定した実際のプロジェクトなので、最初からESlintを使用します。
npm install express
npm install --save-dev eslint @eslint/js typescript-eslint @stylistic/eslint-plugin @types/express

 また、以下の内容のeslint.config.mjsファイルを作成します 。
---------------
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config({
  files: ['**/*.ts'],
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  plugins: {
    '@stylistic': stylistic,
  },
  rules: {
    '@stylistic/semi': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_' },
    ],
  },
});
---------------

tscとnode --watchを同時に実行します。まず、以下を同時にインストールしましょう
npm install --save-dev concurrently

package.jsonの追加
----------
{
  // ...
  "scripts": {
    "tsc": "tsc",
    "dev": "concurrently \"tsc --watch\" \"node --watch index.ts\"",
    "start": "node index.ts",
    "lint": "eslint ."
  },
  // ...
}
----------
TypeScriptをNode.jsで実行する際、enumが消えることがある。それを阻止するためにも--experimental -transform-typesフラグが必要
だがこれを入れたら実行不可能になった
------------
    "dev": "concurrently \"tsc --watch\" \"node --watch --experimental-transform-types index.ts\"",
    "start": "node --experimental-transform-types index.ts",
------------

スキーマ検証ライブラリの使用
リクエストボディにバリデーターを記述するのは大変な作業です。幸いなことに、  役立つ スキーマバリデーターライブラリがいくつか存在します。ここでは、 Zodを見ていきましょう。（新しいタブで開きます） これはTypeScriptと非常に相性が良いです。

npm install zod


TypeScript を使用した Vite
Viteを利用できます （新しいタブで開きます） TypeScriptアプリを作成するには、  初期化スクリプトでテンプレート「react-ts」を指定します。TypeScriptアプリを作成するには、次のコマンドを実行します。
npm create vite@latest my-app-name -- --template react-ts


Part10
アプリケーションの開発にはExpoを使用します。（新しいタブで開きます）Expoは、React Nativeアプリケーションのセットアップ、開発、構築、デプロイを容易にするプラットフォームです。
create-expo-appを使ってプロジェクトを初期化し、Expoを使い始めましょう。

npx create-expo-app rate-repository-app --template blank@sdk-55

次に、ターミナルを使って作成したrate-repository-appディレクトリに移動し  、後ほど必要となるいくつかの依存関係をインストールしましょう。
npx expo install react-native-web react-dom @expo/metro-runtime

シミュレーターの設定方法
https://docs.expo.dev/workflow/android-studio-emulator/#set-up-android-studio
https://docs.expo.dev/workflow/ios-simulator/



===============
ここ抜けてる
===============
React Native アプリケーションでは、同じ @apollo/clientを使用します。（新しいタブで開きます）パート8で説明したライブラリを使用します。まずはgraphql と一緒にライブラリをインストールすることから始めましょう。 （新しいタブで開きます） ピア依存関係として必要なライブラリ：

npm install @apollo/client graphql

ユーザーのデバイスにデータを保存する
ユーザーのデバイスに永続的なデータを保存する必要がある場合があります。よくあるシナリオの1つは、ユーザーの認証トークンを保存して、ユーザーがアプリケーションを閉じて再度開いた場合でも取得できるようにすることです。Web開発では、 localStorage このような機能を実現するためにブラウザのオブジェクトを使用してきました。React Nativeは、同様の永続ストレージである AsyncStorageを提供しています。（新しいタブで開きます）。
 以下のコマンドを使用して、 Expo SDK のバージョンに適したnpx expo install バージョンの @react-native-async-storage/async-storageパッケージをインストールできます 。

npx expo install @react-native-async-storage/async-storage

Part5
React Nativeアプリケーションのテスト
あらゆる種類のコードのテストを開始するには、まずテストフレームワークが必要です。これを使用して一連のテストケースを実行し、その結果を検査できます。JavaScript アプリケーションのテストには、  Jest が適しています。（新しいタブで開きます）は、このようなテストフレームワークの有力な候補です。Expo ベースの React Native アプリケーションを Jest でテストするために、Expo はjest-expo という形式で一連の Jest 設定を提供します。 （新しいタブで開きます） プリセット。まずはパッケージのインストールから始めましょう。

npx expo install jest-expo jest @types/jest --dev

Jestでjest-expoプリセットを使用するには、次の Jest設定を追加する必要があります。（新しいタブで開きます）package.jsonファイル に テスト スクリプト と一緒に追加して ください。
---
{
  // ...
  "scripts": {
    // other scripts...
    "test": "jest"
  },
  "jest": {
    "preset": "jest-expo",
    "transformIgnorePatterns": [
      "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|react-router-native)"
    ]
  }
  // ...
}
---
また、VS Codeがキーワードに対して適切なマッチャーを提案できるように、少し設定を行う必要があります 。これは 、プロジェクトのルートにjsconfig.jsonexpectファイル を作成し、以下の内容を記述することで行えます 。
{
  "compilerOptions": {
    "checkJs": false,
    "types": ["jest"]
  }
}

JestのテストファイルでESLintを使用するには、  eslint-plugin-jestも必要です。（新しいタブで開きます） ESLint用のプラグインです。インストールしてみましょう。
npm install eslint-plugin-jest --save-dev

eslint-plugin-jestプラグインを使用するには、  eslint.config.js ファイルでプラグインを有効にする必要があります。
---
// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const pluginJest = require('eslint-plugin-jest');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    files: ['**/*.test.js', '**/*.spec.js'],
    ...pluginJest.configs['flat/recommended'],
  },
]);

---


第 5部（新しいタブで開きます）私たちはこれらのライブラリの1つであるReact Testing Library に慣れ親しんだ。 （新しいタブで開きます）残念ながら、このライブラリはReact Webアプリケーションのテストにのみ適しています。幸いなことに、このライブラリにはReact Native版があり、それが React Native Testing Libraryです。（新しいタブで開きます）これは、React Nativeアプリケーションのコンポーネントをテストする際に使用するライブラリです。幸いなことに、これらのライブラリは非常に似たAPIを共有しているため、新しい概念を学ぶ必要はほとんどありません。それでは、  @testing-library/react-native ライブラリをプロジェクトにインストールしましょう。

npx expo install @testing-library/react-native --dev

Part11
ルートプロジェクトは以下にシェルファイルを作成し、起動コマンドを記載
chmod +x　で実行権利を付与し、実行できることを確認することでRenderの起動時のコマンドは記載せず、代わりにシェルを実行するように設定
npm install && npm run buildとか

Renderを用いて自動デプロイする方法
Renderでデプロイできることを確認後、setting上のDeploy HookのURLを控える。
Gitのルートプロジェクト上のSEttingsよりsecrets and variables→Actions と進みRepository secretにて変数名と該当URLを保存
.githubのアクションで実行できるようにテストの最後にcurlコマンドにて実行できるよう設定
-----
- name: Trigger deployment
        run: curl ${{ secrets.RENDER_DEPLOY_HOOK }}
-----


プルリクエストで保存し、テストを実行するがオートデプロイ設定時はこの時にif: ${{ github.event_name == 'push' }}がないとデプロイされてしまう。
1. プルリクエスト（Pull Request / PR）ってなに？
一言でいうと、「私の書いたコードを、本番用のコード（main ブランチ）に合体（マージ）させてください！」というお願文書（またはそのやり取りのページ）のことです。いきなり本番の部屋（main）に自分の新しいおもちゃ（コード）を放り込むと、部屋が散らかったり壊れたりするかもしれませんよね。
だから、「一度廊下（プルリクエスト）に置くので、みんなでテストや中身を確認してから本番に入れてもいいですか？」という安全確認のステップを挟むために使います。

2. 「これって何やってるの？」全体の仕組み
いまやっているのは、「安全な自動検査の仕組み（CI/CD）」を作る課題です。
プルリクエストを出したとき（お医者さんの健康診断）：
コードに間違いがないか、テストや文法チェック（ESLintなど）が自動で走ります。この段階ではまだ本番環境（Render）には反映されません（＝デプロイされない）。
main にマージされたとき（本番への正式採用）：
「テストも無事にクリアしたし、本番の部屋に入れてOK！」となったので、自動的に本番サーバー（Render）にコードが反映（＝デプロイ）されます。


バージョン管理
手順1：GitHubの権限設定を確認する（最初におすすめ）
トークンが自動でタグ（バージョン）を書き込めるように、権限を許可しておきます。
GitHubのリポジトリページの上部メニューにある 「Settings（設定）」 をクリック。
左メニューの 「Actions」 ＞ 「General」 をクリック。
一番下までスクロールし、「Workflow permissions」 の項目を探す。
「Read and write permissions」（読み取りおよび書き込み権限）にチェックを入れて Save を押す。

手順2: yamlにtagreleaseを追加
tag_release:
    needs: [simple_deployment_pipeline]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Bump version and push tag
        if: ${{ github.event_name == 'push' }}
        uses: anothrNick/github-tag-action@1.71.0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          DEFAULT_BUMP: patch



Part12 Docker
については別途のファイルで

part13 Relational Databese

コンテナでPostgresの使用　＊パスワード変更してな
docker run -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 postgres

docker ps でIDチェック

docker exec -it ff3f49eadf27 psql -U postgres postgres
コンテナ上で操作可能

psqlコマンド
\d データベースの内容を表示する
\d notes
 
追加コマンド
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    content text NOT NULL,
    important boolean,
    date time
);
値の追加
insert into notes (content, important) values ('Relational databases rule the world', true);
insert into notes (content, important) values ('MongoDB is webscale', false);

insert into blogs (author, URL ,title, likes) values ('Suzuki', "https://en.wikipedia.org/wiki/Ring_(Suzuki_novel)","Ring", 100);
insert into notes (content, important) values ('MongoDB is webscale', false);

リレーショナルデータベースを使用したNodeアプリケーション
通常通りnpm initでアプリケーションを起動し  、 開発依存関係としてnodemon をインストールし 、さらに以下の実行時依存関係もインストールします。
npm install express dotenv pg sequelize

データベースに接続できるかどうかをテストしてみましょう。index.jsというファイルを作成し、以下の内容を追加してください。
-------
require('dotenv').config()
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
})

const main = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()
-------
データベースアドレスと認証情報を含むデータベース接続文字列は、 .envファイルで定義する必要があります。
Aivenを使用している場合、 .envファイルの内容は次のようになります。
---
DATABASE_URL=postgres://userhere:passwordhere@hostnamehere.aivencloud.com:10789/defaultdb
---
?sslmode=require接続文字列から必ず削除してください！

Dockerを使用する場合、接続文字列は次のとおりです。
----
DATABASE_URL=postgres://postgres:mysecretpassword@localhost:5432/postgres
---

モデル
Sequelizeを使用する場合、データベース内の各テーブルは モデルによって表現されます。（新しいタブで開きます）これは実質的に独自の JavaScript クラスです。それでは、 アプリケーションの 表 の注釈に対応するモデルNote を定義する ために、コードを次の形式に変更しましょう。
----
require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express')
const app = express()

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

class Note extends Model {}
Note.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  important: {
    type: DataTypes.BOOLEAN
  },
  date: {
    type: DataTypes.DATE
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'note'
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
----

コンソールからテーブルの削除
drop table notes;


マイグレーション（Migration）とは、一言で言うと「データベースの設計図（構造）を変更・管理するための仕組み（およびそのファイル）」のことです。
プログラムのコードを Git などのバージョン管理システムで管理するように、データベースのテーブル追加やカラム変更の歴史も管理できるようにするものです。
これまでのように、アプリ起動時に sequelize.sync() などを使ってデータベースの構造を自動で同期させていると、以下のような問題が起きます。
すでに本番環境やテスト環境にあるテーブルのデータを消さずに、新しいカラム（列）だけを安全に追加・変更するのが難しい。
複数人で開発しているときや、サーバーをデプロイするときに、データベースの状態が人によってバラバラになってしまう。

Sequelizeコマンドラインツールを使用して、コマンドラインからマイグレーションを実行できます。 （新しいタブで開きます）しかし、我々はUmzugを使用してプログラムコードから手動で移行を実行することを選択する。 （新しいタブで開きます） ライブラリ。ライブラリをインストールしましょう。

npm install umzug


Part14 Next.js

create-next-appツールを使用して Next.js アプリを作成します 
npx create-next-app@latest notes-app

最初に、  layout.tsxファイルの内容を 以下のように変更してください。
--------------------------------------
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
--------------------------------------
次にcontent  page.tsx
--------------------------------------
const Home = () => {
  return <div>hello next.js</div>
}
export default Home
--------------------------------------

Next.jsでは、 アプリ ディレクトリ 内のコンポーネントはデフォルトでReact Server Componentsになります 。これまで記述してきた従来のReactコンポーネントとは異なり、Server Componentsはブラウザではなくサーバー上でレンダリングされます。


静止画レンダリング
開発段階ではアプリは問題なく動作するように見えます。しかし、本番環境向けにアプリケーションをビルドして実行すると、問題が発生します。

アプリを構築して、本番環境で起動してみましょう

変更後にキャッシュされたページが古くなっていることを Next.js に伝えることです。これは revalidatePathを使用して行います。
---------
"use server"

import { redirect } from "next/navigation"
import { addBlog } from "../services/blogs"
import { revalidatePath } from "next/cache"

export const createBlog = async (formData: FormData) => {
  const title = formData.get("title") as string
  const author = formData.get("author") as string
  const url = formData.get("url") as string
  const likes = Number(formData.get("likes")) as number


  addBlog(title, author,url,likes)

    revalidatePath("/blogs")

  redirect("/blogs")
}
---------

次に各ノートごとに個別のビューを作成し、ID 10 のノートが URL notes/10 のページに表示されるようにします。そのためには、 動的なルートセグメントが必要です。Next.js App ルーターでこれを定義する方法は非常に興味深いものです。
ディレクトリ/app/notes/[id]を作成し  、その中に通常のファイル page.tsx を作成します 。

Full Stack Openの以前のパートでは、バックエンドを Render または Fly.ioにデプロイしていました。Next.jsの場合、最も自然なデプロイ先は 、Next.jsを開発・保守しているVercelです
Vercelは、 Neonを基盤とした マネージドPostgreSQLデータベース 「Vercel Postgres」を提供

データベースを作成するには、Vercelダッシュボードにアクセスし、以下の手順に従ってください。

先ほどデプロイしたプロジェクトを開きます。
ストレージ タブに移動します 
「データベースの作成」をクリックします。 
Postgres (Neon)を選択し  、  「続行」をクリックします。
デプロイメントに近いリージョンを選択し、  「作成」をクリックします。
データベースに名前を付け（例：  notes-db）、  [作成]をクリックします。

開発中に同じデータベースをローカルで使用するには、Vercelダッシュボードから接続文字列をコピーし、  プロジェクトのルートディレクトリに.env.localファイルを作成します。

DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
Vercelダッシュボードから取得した実際の接続文字列に値を置き換えてください。Next.jsは 開発中に.env.localを自動的に読み込む ため、追加の設定は不要です。

Drizzle ORMを使用したデータベースアクセス
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit

SequelizeではなくDrizzleを選ぶ理由とは？ DrizzleはTypeScriptを第一級の要素として設計されています。データベーススキーマはTypeScriptで定義され、Drizzleは完全に型付けされたクエリ結果を自動的に生成します。つまり、スキーマでノートに content  （文字列）と important  （ブール値）があると定義されていれば、すべてのクエリ結果がそれに応じて型付けされ、コードを実行する前にコンパイラがエラーを検出します。また、Drizzleは手動で記述するSQLに非常に近いSQLを生成するため、内部で何が起こっているかを容易に理解できます。さらに、DrizzleはVercelのようなサーバーレス環境を強力にサポートしており、接続を慎重に管理する必要がありません。

以下の内容のファイルdb/schema.tsを作成します。
------
import { pgTable, serial, text, boolean } from "drizzle-orm/pg-core"

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  important: boolean("important").notNull().default(false),
})
------

db/index.ts
------
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

export const db = drizzle(process.env.DATABASE_URL!, { schema })
------

プロジェクトルートにあるdrizzle.config.tsファイルとして作成します。

------
import { defineConfig } from "drizzle-kit"

import * as dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
------


Drizzle Kitにスキーマの場所、移行ファイルの出力先、およびデータベースへの接続方法を指示します。
さらに、以下の2つのパッケージをインストールする必要があります。
npm install --save-dev dotenv postgres

これでマイグレーションを生成し、データベースに適用できます。
npx drizzle-kit generate
さっき作った db/schema.ts などのスキーマ定義を読み取って、「こういうテーブルをデータベースに作るためのSQLファイル（設計図）」を自動で生成するコマンド

npx drizzle-kit migrate
さっき生成したSQLファイル（マイグレーションファイル）を、.env.local で繋いだ本番・リモートのデータベース（さっきのNeonのPostgreSQL）に実際に流し込んで、テーブルを実体化（作成）させるコマンド。

テーブルが作成されたことを確認するには、次のコマンドを実行します。
npx drizzle-kit studio

ローカルの移行履歴を削除して、Drizzle Kitが以前に生成されたすべての移行を忘れるようにします。
npx drizzle-kit drop

npx drizzle-kit push 
を実行することで、データベースの中に users テーブルや blogs テーブルが新しく作られ、プログラムが正しく読み書きできるようになるというわけなんだ！

app/services/notes.ts を以下のように変更します  。
------
import { eq } from "drizzle-orm"
import { db } from "../../db"
import { notes } from "../../db/schema"

export const getNotes = async () => {
  return db.query.notes.findMany()
}

// ...
------

 Drizzleには、アプリケーションレベルでテーブル間の関係を定義できる「 リレーション」という機能があります 。これらのリレーション定義はデータベースに保存されず、SQL制約やマイグレーションも生成されません。Drizzleにテーブル間の接続方法を伝えるためだけに存在し、DrizzleのリレーショナルクエリAPIが 関連データを自動的に結合できるようにします。

schema.ts は 次のように変更されます。
-------
import { pgTable, serial, text, boolean, integer } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

export const users = pgTable("users", {
    // ...
})

export const notes = pgTable("notes", {
  // ...
})

export const usersRelations = relations(users, ({ many }) => ({
  notes: many(notes),
})) //usersRelations の 定義によれば、ユーザーは 複数の メモを持つことができる。



export const notesRelations = relations(notes, ({ one }) => ({
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
    //フィールド と 参照 プロパティは、外部キー列を保持する側（この場合は、  user_idが notesテーブルに存在する ため、
    //notes側）で常に必要となることに注意してください 。


  }),
}))
//notesRelations  定義では、ノートは 1 人の ユーザーに属すると定義
-------
 relations 関数は 、 テーブル 間の関係を宣言するために使用されます。最初の引数はテーブル、2 番目の引数はヘルパー関数 ( many、  one ) を受け取り、関連するテーブルを記述するオブジェクトを返すコールバックです


クエリロガー
予期しない動作が発生した場合、Drizzleがデータベースに送信する正確なSQLを確認すると便利です。db  /index.ts で接続を作成する際に ロガーオプションを渡すことで、ログ記録を有効にできます。

強調表示された行数：6
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

export const db = drizzle(process.env.DATABASE_URL!, {
  schema,
  logger: true,
})


Next.jsの認証系
Next.jsアプリに認証機能を追加するために 、Next.jsで最も人気のある認証ライブラリであるNextAuth.jsを使用します。NextAuthは、セッション、コールバック、プロバイダー統合など、認証フロー全体を処理します。また、パスワードを安全にハッシュ化して比較するためにbcryptjsも必要です  。

まず、必要なパッケージをインストールします。
npm install next-auth@beta bcryptjs && npm install -D @types/bcryptjs

スキーマ変更
コースのこれまでの部分と同様に、各ユーザーのハッシュ化されたパスワードを保存する必要があります。 ユーザー テーブルに新しい列が追加されます。
--------
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull().default(""),
})
--------

NextAuthの設定
設定の中核となるのは、NextAuth の設定ファイル auth.tsです。
----
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { db } from "./db"
import { users } from "./db/schema"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const user = await db.query.users.findFirst({
          where: eq(users.username, credentials.username as string),
        })

        if (!user || !user.passwordHash) {
          return null
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash,
        )

        if (!isValid) {
          return null
        }

        return {
          id: String(user.id),
          name: user.name,
          email: user.username,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
})
----

認証APIルート
NextAuthでは、 すべての認証リクエスト（サインイン、サインアウト、セッションチェック）を処理するAPIルートが必要です。app /api/auth/[...nextauth]/route.ts ファイルを作成します 。

[...nextauth] の部分は、Next.js の 包括的なルートセグメントで、 /api/auth/ 配下の任意のパス （例：  /api/auth/signin、  /api/auth/signout、  /api/auth/session）に一致します。NextAuth はこれらすべてをインターセプトし、自動的に処理します。

-----
import { handlers } from "@/auth"

export const { GET, POST } = handlers
-----


NextAuth のuseSessionなどのクライアントサイドフックは  、React コンテキストを介してセッションデータを共有します。そのため、それを使用するコンポーネントの上にプロバイダーコンポーネントを配置する必要があります。NextAuth はまさにこの目的のために独自の SessionProvider を同梱しています 。React コンテキストを使用するため、クライアントコンポーネントである必要がありますが、クライアントコンポーネントをルートレイアウトに直接配置することはできないため、  app/components/SessionProvider.tsx という薄いラッパーを作成します。

--------
"use client"

import { SessionProvider } from "next-auth/react"

export default function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <SessionProvider>{children}</SessionProvider>
}
--------

次に layout.tsxを更新して 、アプリを AuthSessionProviderでラップし、ツリー内のすべてのクライアント コンポーネントが useSessionを介してセッションにアクセスできるようにします。
------
import AuthSessionProvider from "./components/SessionProvider"
import NavBar from "./components/NavBar"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthSessionProvider>
          <NavBar />
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  )
}
------
ナビゲーションバー
ナビゲーションバーは、ユーザーがログインしているかどうかによって異なる表示にする必要があります。ログアウトボタンはonClickハンドラーでsignOut()を呼び出すため 、コンポーネント は クライアント コンポーネントである必要があります。useSessionフックを介してセッションを取得し 、 SessionProvider によって提供されるReactコンテキストから値を取得します 。コンポーネントは app/components/NavBar.tsxに配置します。

-----
"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

export default function NavBar() {
  const { data: session } = useSession()

  return (
    <nav>
      <Link href="/">home</Link>
      {" | "}
      <Link href="/notes">notes</Link>
      {" | "}
      <Link href="/users">users</Link>
      {" | "}
      {session ? (
        <>
          <Link href="/notes/new">create new</Link>
          {" | "}
          <em>{session.user?.name} logged in</em>{" "}
          <button onClick={() => signOut()}>logout</button>
        </>
      ) : (
        <Link href="/login">login</Link>
      )}
    </nav>
  )
}
-----

ログインページ
ログインページは app/login/page.tsxにあります。これはフォーム送信を処理し、エラーメッセージのローカル状態を管理するため、クライアントコンポーネントです。
-------
"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const result = await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirect: false,
    })

    if (result?.error) {
      setError("Invalid username or password")
    } else {
      router.push("/")
      router.refresh()
    }
  }

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Username
            <input type="text" name="username" required />
          </label>
        </div>
        <div>
          <label>
            Password
            <input type="password" name="password" required />
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
-------

サーバー上のセッションを読み込む
サーバーコンポーネントとサーバーアクションでは、フックはブラウザでのみ実行されるため、  useSession は使用できません 。代わりに、Auth.js はサーバー側でリクエストヘッダーからセッションを読み取るauth関数を提供します。これをヘルパー関数app/services/session.ts でラップします 。
------
import { auth } from "@/auth"
import { eq } from "drizzle-orm"
import { db } from "../../db"
import { users } from "../../db/schema"

export const getCurrentUser = async () => {
  const session = await auth()
  if (!session?.user?.email) {
    return null
  }

  return db.query.users.findFirst({
    where: eq(users.username, session.user.email),
  })
}
------

ノート作成アクションの保護
認証機能が実装されたので、  createNote サーバーアクションを保護し、ログインしているユーザーのみがノートを作成できるようにすることができます。
-------
export const createNote = async (formData: FormData) => {
  const session = await auth()
  if (!session) {
    redirect("/login")
  }

  const content = formData.get("content") as string
  const important = formData.get("important") === "on"
  await addNote(content, important)

  revalidatePath("/notes")
  redirect("/notes")
}
-------
addNoteのランダムユーザーハックを、  getCurrentUser の適切な呼び出しに 置き換えることもできます。

------
import { getCurrentUser } from "./session"

export const addNote = async (content: string, important: boolean) => {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Not logged in")
  }

  await db.insert(notes).values({ content, important, userId: user.id })
}
------


環境変数
NextAuthでは、JWTセッショントークンに署名するための秘密鍵が必要です。例えば、以下のように生成できます。

echo "$(openssl rand -base64 32)"

出力結果を 手動で.env.localにコピーしてください 。
DATABASE_URL=postgresql://...
AUTH_SECRET=your-generated-secret-here

Vercelでは、  [設定] > [環境変数]で AUTH_SECRET と AUTH_URL を追加します。AUTH_URLの値は  、デプロイしたアプリの公開URLです。例:  https://your-app.vercel.app。

既存ユーザーのパスワード設定
passwordHash列を追加した後  、データベース内の既存ユーザーのパスワードハッシュは空の文字列になっているため、まだログインできません。これらのユーザーに実際のパスワードを設定する方法が必要です。Drizzle Studio で手動で設定するのではなく、  プロジェクトルートにset-password.ts という小さなユーティリティスクリプトを作成できます。
------
import { config } from "dotenv"
config({ path: ".env.local" })
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"

async function setPassword(username: string, password: string) {
  const { db } = await import("./db")
  const { users } = await import("./db/schema")
  const hash = await bcrypt.hash(password, 10)
  await db
    .update(users)
    .set({ passwordHash: hash })
    .where(eq(users.username, username))
  console.log(`Password set for user: ${username}`)
}

const username = process.argv[2]
const password = process.argv[3]

if (!username || !password) {
  console.log("Usage: npx tsx set-password.ts <username> <password>")
  process.exit(1)
}

setPassword(username, password).then(() => process.exit(0))
------

このスクリプトは、コマンドライン引数からユーザー名と平文パスワードを読み取ります。bcrypt.hashを使用してコスト係数10でパスワードをハッシュ化し 、 データベース内の該当するユーザー行を更新します。コスト係数はハッシュ計算の計算コストを制御します。値が大きいほど総当たり攻撃は遅くなりますが、ログイン時の検証も遅くなります。10は一般的に推奨されるデフォルト値です。

tsxを使用してスクリプトを実行してください 。tsx は、別途コンパイル手順を経ずに TypeScript ファイルを直接実行します。


npx tsx set-password.ts mluukkai secretpassword
このスクリプトは、当然ながら開発用ユーティリティに過ぎません。



ユーザー登録
認証機能が実装できたので、次は適切な登録フローを導入し、新規ユーザーがDrizzle Studio経由で手動で追加されるのではなく、自分でアカウントを作成できるようにしましょう。

パスワードをハッシュ化して新しいユーザーをデータベースに挿入するサーバーアクションが必要です。新しいファイル app/actions/users.tsに追加しましょう。
------
"use server"

import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { db } from "../../db"
import { users } from "../../db/schema"

export const registerUser = async (formData: FormData) => {
  const username = (formData.get("username") as string)?.trim()
  const name = (formData.get("name") as string)?.trim()
  const password = formData.get("password") as string

  const passwordHash = await bcrypt.hash(password, 10)

  await db.insert(users).values({ username, name, passwordHash })

  redirect("/login")
}
------

このアクションは  、フォームデータから ユーザー名、 名前、 パスワードを読み取り、 bcrypt.hashでパスワードをハッシュ化し、新しいユーザーを挿入して、ログインページにリダイレクトします。

このアクションは、成功時に必ずリダイレクトする通常のサーバーアクションであるため、登録ページは、フォームがアクションを直接指すシンプルなサーバーコンポーネントで構いません。
-----
import Link from "next/link"
import { registerUser } from "../actions/users"

export default function RegisterPage() {
  return (
    <div>
      <h2>Register</h2>
      <form action={registerUser}>
        <div>
          <label>
            Username
            <input type="text" name="username" required />
          </label>
        </div>
        <div>
          <label>
            Name
            <input type="text" name="name" required />
          </label>
        </div>
        <div>
          <label>
            Password
            <input type="password" name="password" required />
          </label>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  )
}
-----

useActionStateで検証エラーを返す
フォーム検証のより良い方法は、エラーをスローするのではなく、サーバーアクションからエラーを返し、そのメッセージをフォーム内にインラインで表示することです。React 19では、 まさにこの目的のためにuseActionState フックが提供されています。

サーバーアクションのシグネチャを変更する必要があります。formData のみを受け取る代わりに、最初の引数としてprevState も受け取るようにします。これは、アクションによって返された以前の状態（または最初のレンダリング時の初期値）です。アクションは実際には prevState を使用しませんが、useActionState が期待するシグネチャと一致するように、prevState を受け入れる必要があります。

検証に失敗した場合、エラーメッセージを含む新しい状態オブジェクトを返します。成功した場合は、以前と同様にリダイレクトを呼び出します。

Tailwind CSSを使用してアプリのスタイルを設定する
これまで、  スタイル設定が必要なごく少数のケースでは、 インラインスタイルオブジェクトを使用してきました。しかし、実際のアプリケーションでは、CSSに対する適切なアプローチが必要です。Next.jsのエコシステムにおいて主流となっているのは、ユーティリティファーストのCSSフレームワークであるTailwind CSSです。

同じことを実現する別の方法として、CSS ファイルで Tailwind の @layer components ディレクティブを使用する方法があります。これにより、個別の React コンポーネントを作成することなく、複数の Tailwind ユーティリティを組み合わせたカスタム CSS クラスを定義できます。どちらの方法も効果的です。React コンポーネントを抽出することで、スタイリング ロジックをコンポーネント構造と同じ場所に保持できます。一方、CSS レイヤー方式では、すべてのスタイリング定義を 1 つの CSS ファイルにまとめることができます。

MDXを読み込むための公式ライブラリ
npm install @next/mdx @mdx-js/loader @mdx-js/rollup remark-gfm
