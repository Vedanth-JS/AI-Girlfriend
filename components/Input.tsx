"use client"

import { useState } from "react"

interface InputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export default function Input({ onSend, disabled }: InputProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSend(message)
      setMessage("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-700">
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={disabled}
          className="flex-1 p-3 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800"
        />
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </form>
  )
}
