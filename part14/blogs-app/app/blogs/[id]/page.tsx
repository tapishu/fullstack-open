import { notFound } from "next/navigation"
import { getBlogById } from "../../services/blogs"
import { increaseLike } from "../../actions/blogs"
import { Suspense } from "react"
const BlogPageContent = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const blog = getBlogById(Number(id))

  if (!blog) {
    notFound()
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <p>{blog.author} {blog.url} </p>
      <p>{blog.likes}</p>
      <form action={increaseLike}>
        <input type="hidden" name="id" value={blog.id}/>
        <button type="submit">
        Like +1
        </button>
      </form>
    </div>
  )
}
const BlogPage = async ({ params }: { params: Promise<{ id: string }> }) => {
return(
    <div>
        <Suspense fallback={<div>Loading</div>}>
        <BlogPageContent params={params}/>
        </Suspense>
    </div>
)

}


export default BlogPage