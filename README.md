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
