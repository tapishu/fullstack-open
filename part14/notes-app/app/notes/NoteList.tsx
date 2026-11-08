"use client"

import Link from "next/link"
import { useState } from "react"

type Note = {
  id: number
  content: string
  important: boolean
}

const NoteList = ({ notes }: { notes: Note[] }) => {
  const [showImportant, setShowImportant] = useState(false)

  const notesToShow = showImportant
    ? notes.filter((note) => note.important)
    : notes

  return (
    <div>
      <button onClick={() => setShowImportant(!showImportant)}>
        {showImportant ? "Show all" : "Show important"}
      </button>
      <ul>
        {notesToShow.map((note) => (
          <li key={note.id}>
            <Link href={`/notes/${note.id}`}>{note.content}</Link>
            {note.important && <strong> (important)</strong>}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default NoteList