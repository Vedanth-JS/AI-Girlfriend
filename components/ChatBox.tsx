"use client";

import { useEffect, useRef } from "react";
import Message from "./Message";
import ChatInput from "./ChatInput";
import Personality from "./Personality";
import Loading from "./Loading";
import { MessageSquareOff, Heart, User, CheckCircle2 } from "lucide-react";

interface ChatBoxProps {
    conversation: any;
    messages: any[];
    loading: boolean;
    aiLoading: boolean;
    onSend: (text: string) => void;
    onChangePersonality: (personality: string) => void;
}

const COMPANION_PROFILES: Record<string, { name: string; avatar: string; bio: string; status: string }> = {
    cute: {
        name: "Luna",
        avatar: "😊",
        bio: "A sweet, bubbly companion who loves cute emojis and positive vibes.",
        status: "Online & thinking of you"
    },
    friendly: {
        name: "Chloe",
        avatar: "🤗",
        bio: "Your encouraging cheerleader, always ready to support and motivate you.",
        status: "Active & supportive"
    },
    romantic: {
        name: "Elena",
        avatar: "💕",
        bio: "Deep, caring, and looking for a meaningful, warm relationship.",
        status: "Warm & affectionate"
    },
    anime: {
        name: "Sakura",
        avatar: "🎌",
        bio: "High-energy, bubbly companion who occasionally calls you Senpai.",
        status: "Waiting for Senpai! 🍙"
    },
    funny: {
        name: "Gigi",
        avatar: "😂",
        bio: "Always ready to crack a joke, send memes, and brighten up your day.",
        status: "Looking up jokes"
    }
};

const ICEBREAKERS = [
    { text: "Tell me a joke! 🎭", prompt: "Tell me a joke!" },
    { text: "Compliment me! 💕", prompt: "Can you give me a sweet compliment?" },
    { text: "What are your hobbies? 🎨", prompt: "What are your favorite hobbies?" },
    { text: "Say something sweet! 🥰", prompt: "Say something romantic and sweet to me." }
];

function getRelationshipInfo(score: number) {
    if (score <= 20) {
        return { name: "Stranger 🤍", progress: (score / 20) * 100, color: "text-gray-400" };
    } else if (score <= 50) {
        return { name: "Friend 💛", progress: ((score - 20) / 30) * 100, color: "text-yellow-500" };
    } else if (score <= 80) {
        return { name: "Crush 💖", progress: ((score - 50) / 30) * 100, color: "text-violet-600 dark:text-violet-400" };
    } else {
        return { name: "Soulmate ❤️", progress: 100, color: "text-red-500" };
    }
}

export default function ChatBox({
    conversation,
    messages,
    loading,
    aiLoading,
    onSend,
    onChangePersonality
}: ChatBoxProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto scroll to bottom when messages or loading state changes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, aiLoading]);

    if (!conversation) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-gray-950 p-8 text-center text-gray-900 dark:text-gray-100">
                <div className="bg-violet-600/10 border border-violet-600/20 p-6 rounded-3xl mb-4">
                    <MessageSquareOff className="w-12 h-12 text-violet-500" />
                </div>
                <h3 className="text-xl font-bold mb-1">No Active Chat</h3>
                <p className="text-gray-400 max-w-sm text-sm">
                    Select a conversation from the sidebar or start a new chat to begin!
                </p>
            </div>
        );
    }

    const personalityKey = conversation.personality || "cute";
    const profile = COMPANION_PROFILES[personalityKey] || COMPANION_PROFILES.cute;
    const rel = getRelationshipInfo(conversation.affectionScore || 0);

    return (
        <div className="flex-1 flex h-full min-w-0 bg-white dark:bg-gray-950">
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 border-r border-gray-200 dark:border-white/5 h-full">
                {/* Personality selector at the top */}
                <div className="border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-black/20 flex flex-col md:flex-row items-center justify-between px-6 py-3 shrink-0 gap-3">
                    <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest">
                        Personality:
                    </span>
                    <Personality
                        selected={personalityKey}
                        onSelect={onChangePersonality}
                    />
                </div>

                {/* Messages box */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-6">
                            <span className="text-5xl mb-4 animate-bounce">{profile.avatar}</span>
                            <h4 className="text-lg font-bold text-gray-800 dark:text-white">Say hello to {profile.name}! ❤️</h4>
                            <p className="text-xs text-gray-500 max-w-sm mt-1 mb-6">
                                She is online as your AI companion. Choose an icebreaker below or type a custom message to start chatting!
                            </p>
                            
                            <div className="grid grid-cols-2 gap-3 max-w-md w-full">
                                {ICEBREAKERS.map((ib, i) => (
                                    <button
                                        key={i}
                                        onClick={() => onSend(ib.prompt)}
                                        className="bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 active:scale-[0.98] transition-all text-center"
                                    >
                                        {ib.text}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        messages.map((m, i) => (
                            <Message
                                key={i}
                                role={m.role}
                                content={m.content}
                            />
                        ))
                    )}

                    {/* AI Thinking/Typing indicator */}
                    {aiLoading && (
                        <div className="flex justify-start">
                            <div className="bg-violet-50 dark:bg-violet-950/25 border border-violet-100 dark:border-violet-500/10 p-4 rounded-2xl max-w-md">
                                <Loading />
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input field */}
                <ChatInput onSend={onSend} disabled={aiLoading} />
            </div>

            {/* Companion Dashboard Panel on the right (collapsible/visible on desktop) */}
            <div className="hidden lg:flex w-80 bg-gray-50/50 dark:bg-gray-950/20 shrink-0 flex-col p-6 text-gray-900 dark:text-gray-100 overflow-y-auto gap-6 border-l border-gray-200 dark:border-white/5">
                {/* Companion Main Header */}
                <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-24 h-24 rounded-full bg-violet-600/10 dark:bg-violet-600/20 border-2 border-violet-500 flex items-center justify-center text-5xl relative shadow-xl shadow-violet-950/10">
                        {profile.avatar}
                        <div className="absolute bottom-0 right-1 w-4 h-4 bg-green-500 border-2 border-gray-50 dark:border-gray-950 rounded-full animate-pulse" />
                    </div>
                    <div className="mt-2">
                        <h3 className="text-xl font-bold flex items-center justify-center gap-1.5">
                            {profile.name}
                            <CheckCircle2 className="w-4 h-4 text-violet-500 fill-violet-500/10 shrink-0" />
                        </h3>
                        <span className="text-[10px] font-semibold text-green-500 tracking-wider uppercase flex items-center justify-center gap-1.5">
                            {profile.status}
                        </span>
                    </div>
                </div>

                <hr className="border-gray-200 dark:border-white/5" />

                {/* Companion Bio */}
                <div className="space-y-2">
                    <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                        About Companion
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-3.5 rounded-2xl">
                        {profile.bio}
                    </p>
                </div>

                {/* Relationship level card */}
                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                        Relationship
                    </h4>
                    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-2xl space-y-3 shadow-sm">
                        <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-gray-500 dark:text-gray-400">Status:</span>
                            <span className={`${rel.color} flex items-center gap-1.5 font-extrabold`}>
                                <Heart className="w-3.5 h-3.5 fill-current animate-bounce" />
                                {rel.name}
                            </span>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="relative w-full h-2.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden border border-gray-200/50 dark:border-transparent">
                            <div
                                className="absolute left-0 top-0 h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500 rounded-full"
                                style={{ width: `${rel.progress}%` }}
                            />
                        </div>

                        <div className="flex justify-between items-center text-[10px] text-gray-500 dark:text-gray-400">
                            <span>Affection Score</span>
                            <span className="font-semibold">{conversation.affectionScore || 0} pts</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
