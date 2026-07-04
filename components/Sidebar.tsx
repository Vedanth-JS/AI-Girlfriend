"use client";

import { MessageSquare, Trash2, Heart, Plus } from "lucide-react";

interface SidebarProps {
    conversations: any[];
    activeId: string | null;
    loading: boolean;
    onSelect: (id: string) => void;
    onCreate: () => void;
    onDelete: (id: string) => void;
}

export default function Sidebar({
    conversations,
    activeId,
    loading,
    onSelect,
    onCreate,
    onDelete
}: SidebarProps) {
    return (
        <aside className="w-80 bg-gray-50 dark:bg-gray-950 border-r border-gray-200 dark:border-white/10 flex flex-col h-full shrink-0">
            {/* Header branding */}
            <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-violet-600/20 p-2 rounded-xl border border-violet-600/30">
                        <Heart className="w-6 h-6 text-violet-600 fill-violet-600/20 animate-pulse" />
                    </div>
                    <span className="text-xl font-black bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent tracking-wider">
                        V AI
                    </span>
                </div>
            </div>

            {/* Action button */}
            <div className="px-4 py-6">
                <button
                    onClick={onCreate}
                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-violet-950/20 hover:shadow-violet-900/30 active:scale-[0.98] transition-all"
                >
                    <Plus className="w-5 h-5" />
                    New Chat
                </button>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto px-3 space-y-1">
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                    Recent Conversations
                </h3>

                {loading ? (
                    <div className="text-center text-gray-500 py-8 text-sm">
                        Loading conversations...
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="text-center text-gray-500 py-12 text-sm border border-dashed border-gray-200 dark:border-white/5 rounded-2xl mx-3 p-4">
                        No conversations yet.<br />Click &quot;+ New Chat&quot; to start!
                    </div>
                ) : (
                    conversations.map((c) => {
                        const isActive = c.id === activeId;
                        const companionInfo = {
                            cute: { name: "Luna", emoji: "😊" },
                            friendly: { name: "Chloe", emoji: "🤗" },
                            romantic: { name: "Elena", emoji: "💕" },
                            anime: { name: "Sakura", emoji: "🎌" },
                            funny: { name: "Gigi", emoji: "😂" }
                        }[c.personality as string || "cute"] || { name: "Luna", emoji: "😊" };

                        return (
                            <div
                                key={c.id}
                                className={`group flex items-center justify-between rounded-xl p-3.5 transition-all cursor-pointer relative ${
                                    isActive
                                        ? "bg-violet-600/10 border border-violet-500/30 text-violet-600 dark:text-white shadow-inner"
                                        : "hover:bg-gray-200 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 border border-transparent"
                                }`}
                                onClick={() => onSelect(c.id)}
                            >
                                <div className="flex items-center gap-3 min-w-0 pr-4">
                                    <span className="text-sm shrink-0">{companionInfo.emoji}</span>
                                    <span className="font-semibold text-sm truncate">
                                        {companionInfo.name} <span className="text-xs font-normal text-gray-400 dark:text-gray-500">({c.title})</span>
                                    </span>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(c.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 hover:bg-white/10 text-gray-500 hover:text-red-400 p-1.5 rounded-lg transition-all shrink-0"
                                    title="Delete conversation"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </aside>
    );
}
