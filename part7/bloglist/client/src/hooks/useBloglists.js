import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotificationContext, useNotify } from '../NotificationContext'

import blogService from '../services/blogs'


export const useBloglists = ()=>{
const queryClient = useQueryClient() //リモコンを取り出す！
const notify = useNotify() // 🟢 フックの中で通知関数を取り出す！

const result = useQuery({
    queryKey:["blogs"], 
    //TanStack Query は、この名前（"blogs"）を元に取得したデータを一時的に保存（キャッシュ）する。
    // 他の場所で同じ ["blogs"] を指定すると、同じデータを共有できる。
    queryFn:blogService.getAll,
refetchOnWindowFocus: false,
    retry: 1
})

// result の中身:
// result.data: 届いたデータ一覧
// result.isPending / isLoading: 読み込み中かどうか（true / false）
// result.isError: 取得に失敗したかどうか（true / false）

const newBlogMutation = useMutation({ //useMutation: データを変更する（POST / PUT）
mutationFn: blogService.create,
    onSuccess: (newBlog) => { // 🟢 サーバーから返ってきたデータを受け取る
        // 画面のキャッシュ（メモ帳）に直接新しいデータを追加して即反映
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog)) 
    notify(`${newBlog.title} has been created`)
    },
    onError: (error) => {
notify(error.message, "error")    }

})

  const updateBlogMutation = useMutation({ //useMutation: データを変更する（POST / PUT）
    mutationFn: ({id, newObject})=> blogService.update(id,newObject),
    onSuccess: (updateBlog) => { // 🟢 サーバーから返ってきたデータを受け取る
      queryClient.invalidateQueries({ queryKey: ['blogs'] })//投票したらメモ帳を古い扱いにして、サーバーから最新の投票数を読み直させます。
      notify(`liked ${updateBlog.title}`)
    },
    onError: () => {
      notify('failed to like blog',"error")
    }

  })

  const removeBlogMutation = useMutation({
    mutationFn:(blog)=>blogService.remove(blog.id),
    onSuccess:(data,blog)=>{
      const blogs = queryClient.getQueryData(["blogs"])
      queryClient.setQueryData(["blogs"], blogs.filter((b)=>b.id !== blog.id))
      notify(`removed ${blog.title}`)
    },
    onError: ()=>{
            notify('failed to remove',"error")
    }
  })

  const addCommentMutation = useMutation({
    mutationFn:({id, newComment})=> blogService.addComment(id,newComment),
    onSuccess: () =>{
    queryClient.invalidateQueries({ queryKey: ['blogs'] })//投票したらメモ帳を古い扱いにして、サーバーから最新の投票数を読み直させます。
      notify(`added a new comment`)
    },
    onError:()=>{
      notify("failed to add a new comment","error")
    }
  })

return{
    blogs:result.data||[],
    isPending: result.isPending,
    isError:result.isError,
    addBlog: (blogObject) => newBlogMutation.mutate(blogObject),
likeBlog: (blog) => {
  const newObject = {
    user: blog.user?.id || blog.user,
    likes: blog.likes + 1,
    author: blog.author,
    title: blog.title,
    url: blog.url
  }
  updateBlogMutation.mutate({ id: blog.id, newObject })
},
  removeBlog: (blogObject) => removeBlogMutation.mutate(blogObject),
  addComment: (id,comment) =>{
addCommentMutation.mutate({id,newComment:{comment}})
  }

}
}

