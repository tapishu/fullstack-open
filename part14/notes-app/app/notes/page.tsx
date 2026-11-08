// import { getNotes } from "../services/notes"
// import Link from "next/link"
// import NoteList from "./NoteList"


// const Notes = () => {
//     const notes = getNotes()

//   return (
//         <div>
//       <h2>Notes</h2>
//       <NoteList notes={notes} />
//     </div>
//     // <div>
//     //   <h2>Notes</h2>
//     //   <ul>
//     //     {notes.map(note => (
//     //       <li key={note.id}>
//     //                     <Link href={`/notes/${note.id}`}>{note.content}</Link>
//     //         {note.content} {note.important && <strong>(important)</strong>}
//     //       </li>
//     //     ))}
//     //   </ul>
//     // </div>
//   )
// }
// export default Notes

import Link from "next/link"
import { getNotes } from "../services/notes"

import { Suspense } from "react" // ① Suspenseをインポート


const NotesContent = async ({
  searchParams,
}: {
  searchParams: Promise<{ important?: string }>
}) => {
  const { important } = await searchParams
  const showImportant = important === "true"
  const allNotes = getNotes()
  const notes = showImportant
    ? allNotes.filter((note) => note.important)
    : allNotes

  return (
    <div>
      {/* <h2>Notes</h2> */}
      <div>
        <Link href={showImportant ? "/notes" : "/notes?important=true"}>
          {showImportant ? "show all" : "show important only"}
          {/* ここでリンクを変えることで再レンダリングがされる。そうしてimportantの有無でnotesがかわる */}
        </Link>
      </div>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <Link href={`/notes/${note.id}`}>{note.content}</Link>
            {note.important && <strong> (important)</strong>}
          </li>
        ))}
      </ul>
    </div>
  )
}

const Notes = ({
  searchParams,
}: {
  searchParams: Promise<{ important?: string }>
}) =>{
  return(
    <div>
      <h2>Notes</h2>
      <Suspense fallback={<div>Loading notes</div>}>
      <NotesContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

export default Notes
