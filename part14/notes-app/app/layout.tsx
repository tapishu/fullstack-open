//アプリ全体の外枠を決める
//昔のReact（Viteなど）やHTMLファイルでは、index.html の中に <html> や <body> が書いてありましたよね。
//しかし、Next.jsのApp Routerの世界では、この RootLayout が <html> や <body> を提供する唯一の場所になります。

import Link from "next/link"


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <nav>
          <Link href="/">home</Link>
          {" | "}
          <Link href="/notes">notes</Link>
          {" | "}
          <Link href="/notes/new">create new</Link>
        </nav>
        {children}
      </body>
    </html>
  )
}