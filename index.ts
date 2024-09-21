type Status = "pending" | "completed"

interface Note {
  id: number
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  status: Status

  // Додамо методи, які є у класах
  edit(title: string, content: string): void
  complete(): void
}

class DefaultNote implements Note {
  id: number
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  status: Status

  constructor(id: number, title: string, content: string) {
    if (!title || !content) {
      throw new Error("Title and content cannot be empty.")
    }
    this.id = id
    this.title = title
    this.content = content
    this.createdAt = new Date()
    this.updatedAt = new Date()
    this.status = "pending"
  }

  edit(title: string, content: string) {
    if (!title || !content) {
      throw new Error("Title and content cannot be empty.")
    }
    this.title = title
    this.content = content
    this.updatedAt = new Date()
  }

  complete() {
    this.status = "completed"
  }
}

class ConfirmableNote extends DefaultNote {
  confirmEdit() {
    console.log(`Confirm changes to note: "${this.title}"? (Y/N)`)
  }

  edit(title: string, content: string) {
    this.confirmEdit()
    super.edit(title, content)
  }
}

class TodoList {
  private notes: Note[] = []
  private nextId = 1

  addNote(title: string, content: string, confirmable: boolean = false) {
    let note: Note
    if (confirmable) {
      note = new ConfirmableNote(this.nextId++, title, content)
    } else {
      note = new DefaultNote(this.nextId++, title, content)
    }
    this.notes.push(note)
  }

  deleteNote(id: number) {
    this.notes = this.notes.filter(note => note.id !== id)
  }

  editNote(id: number, title: string, content: string) {
    const note = this.getNoteById(id)
    if (note) {
      note.edit(title, content)
    }
  }

  completeNote(id: number) {
    const note = this.getNoteById(id)
    if (note) {
      note.complete()
    }
  }

  getNoteById(id: number): Note | undefined {
    return this.notes.find(note => note.id === id)
  }

  getAllNotes(): Note[] {
    return this.notes
  }

  getPendingNotes(): Note[] {
    return this.notes.filter(note => note.status === "pending")
  }

  getCompletedNotes(): Note[] {
    return this.notes.filter(note => note.status === "completed")
  }

  getNotesCount(): number {
    return this.notes.length
  }

  getPendingNotesCount(): number {
    return this.getPendingNotes().length
  }

  searchNotes(query: string): Note[] {
    return this.notes.filter(
      note => note.title.includes(query) || note.content.includes(query)
    )
  }

  sortNotesByStatus(): Note[] {
    return [...this.notes].sort((a, b) => a.status.localeCompare(b.status))
  }

  sortNotesByCreationTime(): Note[] {
    return [...this.notes].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    )
  }
}

// Використання:
const todoList = new TodoList()

// Додаємо нотатки
todoList.addNote("Buy groceries", "Buy milk, eggs, and bread.")
todoList.addNote("Walk the dog", "Take the dog for a walk in the park.", true)

// Отримуємо всі нотатки
console.log(todoList.getAllNotes())

// Редагуємо нотатку
todoList.editNote(1, "Buy groceries", "Buy milk, eggs, bread, and bananas.")

// Позначаємо як виконану
todoList.completeNote(1)

// Сортуємо нотатки за статусом
console.log(todoList.sortNotesByStatus())

// Сортуємо за часом створення
console.log(todoList.sortNotesByCreationTime())

// Пошук нотатки за ім'ям або змістом
console.log(todoList.searchNotes("dog"))

// Отримуємо кількість невиконаних нотаток
console.log(todoList.getPendingNotesCount())
