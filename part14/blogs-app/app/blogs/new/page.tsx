import {createBlog} from "../../actions/blogs"

//FormData オブジェクトはFormDataという形式でしか送れない



const NewBlog = () => {
  return (
    <div>
      <h2>New Blog</h2>
      <form action={createBlog}>
        <div>
          <label>
            title
            <input type="text" name="title" required />
          </label>
        </div>
                <div>
          <label>
            author
            <input type="text" name="author" required />
          </label>
        </div>
                <div>
          <label>
            url
            <input type="text" name="url" required />
          </label>
        </div>
                <div>
          <label>
            likes
            <input type="number" name="likes" required />
          </label>
        </div>
                <button type="submit">Create</button>
      </form>
    </div>
  )
}
export default NewBlog