"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
    onSend: (text: string) => void;
    disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
    const [text, setText] = useState("");

    function handleSend() {
        if (!text.trim() || disabled) return;
        onSend(text);
        setText("");
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            handleSend();
        }
    }

    return (
        <div className="border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-black/10 p-4 flex gap-3 shrink-0 items-center">
            <input
                className="flex-1 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={disabled ? "Waiting for response..." : "Type your message..."}
                disabled={disabled}
            />
            <button
                onClick={handleSend}
                disabled={disabled || !text.trim()}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold p-3.5 rounded-xl shadow-lg shadow-violet-950/20 hover:shadow-violet-900/30 active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none"
            >
                <Send className="w-5 h-5" />
            </button>
        </div>
    );
}
