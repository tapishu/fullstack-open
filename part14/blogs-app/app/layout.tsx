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
          {"|"}
          <Link href="/blogs">blogs</Link>
          {"|"}
          <Link href="/blogs/new">new blog</Link>
          {"|"}
        </nav>
        {children}

      </body>
    </html>
  )
}