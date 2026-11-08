import { notFound } from "next/navigation"
import { getNoteById } from "../../services/notes"
import { toggleNoteImportance } from "../../actions/notes"
import { Suspense } from "react"


const NotePageContent= async({ params }: { params: Promise<{ id: string }> })=>{
    const { id } = await params
  const note = getNoteById(Number(id))

  if (!note) {
    notFound()
  }

  return (
    <div>
      <h2>{note.content}</h2>
      <p>{note.important ? "Important" : "Not important"}</p>
            <form action={toggleNoteImportance}>
        <input type="hidden" name="id" value={note.id} />
        <button type="submit">
          {note.important ? "Mark as not important" : "Mark as important"}
        </button>
      </form>
    </div>
  )
}

const NotePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <div>
<Suspense fallback={<div>Loading note...</div>}>
<NotePageContent params={params}/>
</Suspense>
    </div>
  )
}

export default NotePage