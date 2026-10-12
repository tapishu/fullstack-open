import React from 'react'

// // × これだとただのJSのクラス。Reactとしては動かない
// class ErrorBoundary { ... }

// // ◯ React.Component の機能を全継承するので、Reactコンポーネントとして動く！
// class ErrorBoundary extends React.Component { ... }

class ErrorBoundary extends React.Component {
  //React.Component という親クラスを継承（extends）している
  constructor(props) {
    // エラー状態（hasError）と捕捉したエラーオブジェクト（error）の初期値を定義
    super(props) //親である React.Component の機能を正しく引き継ぎ、コンポーネント内で this を使えるように設定します。
    this.state = { hasError: false, error: null } //最初はエラーが起きていないので、hasError（エラー発生フラグ）を false、error（エラー内容）を null（空っぽ）にしてスタートします。
  }
  //このコンポーネントが生まれる瞬間に、「エラーが起きているかどうか」を管理する状態（state）を初期化

  //error:実際に発生したエラーオブジェクト（例: throw new Error(...) で投げられた中身）が渡され
  static getDerivedStateFromError(error) {
    //エラー検知と画面切替の合図
    return { hasError: true, error }
  }
  //インスタンス（画面の描画処理など）が作られる前や、エラーで崩壊している最中でも、Reactが外部から直接呼び出せる独立した関数にするために static がついています。

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>something went wrong.</h2>
          <p>{this.state.error.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
