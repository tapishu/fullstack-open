import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, createAnecdote, updateAnecdote } from '../requests'
import { useNotificationContext, useNotify } from '../NotificationContext'

export const useAnecdotes = ()=>{
const queryClient = useQueryClient() //リモコンを取り出す！
const notify = useNotify() // 🟢 フックの中で通知関数を取り出す！

const result = useQuery({
    queryKey:["anecdotes"], // ["anecdotes"]: キャッシュ（メモ帳）につける名前ラベルです。
    queryFn:getAnecdotes, //getAnecdotes: 実際にサーバーへ通信してデータを取りに行く関数です。
refetchOnWindowFocus: false,
    retry: 1
})

// result の中身:
// result.data: 届いたデータ一覧
// result.isPending / isLoading: 読み込み中かどうか（true / false）
// result.isError: 取得に失敗したかどうか（true / false）

const newAnecdoteMutation = useMutation({ //useMutation: データを変更する（POST / PUT）
mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => { // 🟢 サーバーから返ってきたデータを受け取る
        // 画面のキャッシュ（メモ帳）に直接新しいデータを追加して即反映
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote)) 
    notify(`${newAnecdote.content} has been created`)
    },
    onError: (error) => {
notify(error.message)    }

})

  const updateAnecdoteMutation = useMutation({ //useMutation: データを変更する（POST / PUT）
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => { // 🟢 サーバーから返ってきたデータを受け取る
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })//投票したらメモ帳を古い扱いにして、サーバーから最新の投票数を読み直させます。
      notify(`Voted ${updatedAnecdote.content}`)
    },
    onError: () => {
      notify('failed to update anecdote')
    }

  })

return{
    anecdotes:result.data||[],
    isPending: result.isPending,
    isError:result.isError,
    addAnecdote: (content) => newAnecdoteMutation.mutate({content, votes:0}),
    voteAnecdote:(anecdote)=> updateAnecdoteMutation.mutate({
        ...anecdote, votes: anecdote.votes +1
    })
}

}