"use client"

interface PersonalityProps {
  selected: string
  onSelect: (personality: string) => void
}

const personalities = [
  { id: "cute", name: "Cute", emoji: "😊" },
  { id: "friendly", name: "Friendly", emoji: "🤗" },
  { id: "romantic", name: "Romantic", emoji: "💕" },
  { id: "anime", name: "Anime", emoji: "🎌" },
  { id: "funny", name: "Funny", emoji: "😂" },
]

export default function Personality({ selected, onSelect }: PersonalityProps) {
  return (
    <div className="flex flex-wrap gap-2 p-4">
      {personalities.map((p) => (
        <button
          key={p.id}
          onClick={() => onSelect(p.id)}
          className={`px-4 py-2 rounded-full transition-all text-xs sm:text-sm font-semibold border ${
            selected === p.id
              ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-violet-500/20 shadow-md shadow-violet-950/40"
              : "bg-white/5 border-white/10 text-gray-400 hover:text-gray-200 hover:bg-white/10"
          }`}
        >
          {p.emoji} {p.name}
        </button>
      ))}
    </div>
  )
}
