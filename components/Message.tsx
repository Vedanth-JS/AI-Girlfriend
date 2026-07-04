"use client";

import { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface Props {
    role: string;
    content: string;
}

export default function Message({ role, content }: Props) {
    const [speaking, setSpeaking] = useState(false);

    // Cancel speech on unmount
    useEffect(() => {
        return () => {
            if (typeof window !== "undefined" && "speechSynthesis" in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    function handleSpeak() {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

        if (speaking) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
            return;
        }

        window.speechSynthesis.cancel();
        
        // Remove emojis from speech to make it sound cleaner
        const cleanContent = content.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]/g, "");
        const utterance = new SpeechSynthesisUtterance(cleanContent || content);
        
        // Find high quality female/assistant voice
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(v => 
            v.name.toLowerCase().includes("female") || 
            v.name.toLowerCase().includes("zira") || 
            v.name.toLowerCase().includes("google us english") || 
            v.name.toLowerCase().includes("samantha") || 
            v.name.toLowerCase().includes("hazel")
        );
        
        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }
        
        utterance.pitch = 1.1; // Slightly higher pitch for friendly/bubbly feel
        utterance.rate = 1.0;

        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);

        setSpeaking(true);
        window.speechSynthesis.speak(utterance);
    }

    return (
        <div
            className={`mb-4 flex items-center gap-2 ${
                role === "user" ? "justify-end" : "justify-start"
            }`}
        >
            <div
                className={`max-w-xl p-4 rounded-2xl text-sm leading-relaxed shadow-md transition-all ${
                    role === "user"
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-none shadow-violet-950/20"
                        : "bg-violet-50 dark:bg-violet-950/25 border border-violet-100 dark:border-violet-500/10 text-violet-950 dark:text-violet-100 rounded-bl-none backdrop-blur-md"
                }`}
            >
                {content}
            </div>

            {role === "assistant" && (
                <button
                    onClick={handleSpeak}
                    className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-violet-600 hover:dark:text-violet-400 transition-all shrink-0"
                    title="Speak text"
                >
                    {speaking ? <VolumeX className="w-4 h-4 text-violet-500" /> : <Volume2 className="w-4 h-4" />}
                </button>
            )}
        </div>
    );
}
