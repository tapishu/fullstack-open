"use server"

import { redirect } from "next/navigation"
import { addBlog,addLike } from "../services/blogs"
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

export const increaseLike = async (FormData: FormData)=>{
const id =Number(FormData.get("id"))

addLike(id)
  revalidatePath(`/blogs/${id}`)
  revalidatePath("/blogs")

}
