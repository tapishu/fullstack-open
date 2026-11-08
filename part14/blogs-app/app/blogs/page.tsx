import {getBlogs} from "../services/blogs"
import Link from "next/link"

const Blogs = async({
  searchParams,
}:{
  searchParams: Promise<{filter?: string}>
}) => {
  const {filter}= await searchParams
  const Allblogs = getBlogs()
const filterExist = Boolean(filter)


const sortedBlogs = [...Allblogs].sort((a,b) => b.likes - a.likes)
const blogs = filterExist && filter ? sortedBlogs.filter((blog) => blog.title.toLowerCase().includes(filter.toLowerCase())) : sortedBlogs


  return (
    <div>
      <h2>Blogs</h2>
      <form method="GET">
        <input 
          type="text" 
          name="filter" 
          defaultValue={filter || ""} 
          placeholder="" 
        />
        <button type="submit">search</button>
      </form>

{/* <Link href={filterExist ? "/blogs" : `/blogs?filter=${filter}`}></Link> */}

{filterExist && (
        <div style={{ margin: "10px 0" }}>
          <Link href="/blogs">All</Link>
        </div>
      )}

      <ul>
        {blogs.map(blog => (
          <li key={blog.id}>
            <Link href={`/blogs/${blog.id}`}>{blog.title}</Link>
             {blog.author} {blog.url} likes: {blog.likes}
          </li>
        ))}
      </ul>
    </div>
  )
}
export default Blogs