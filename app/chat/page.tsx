"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import ChatBox from "@/components/ChatBox";
import toast from "react-hot-toast";

export default function Chat() {
    const [conversations, setConversations] = useState<any[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);

    // Fetch conversations on load
    useEffect(() => {
        fetchConversations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch messages when active conversation changes
    useEffect(() => {
        if (activeConversationId) {
            fetchMessages(activeConversationId);
        } else {
            setMessages([]);
        }
    }, [activeConversationId]);

    async function fetchConversations() {
        setLoadingConversations(true);
        try {
            const res = await axios.get("/api/conversations");
            setConversations(res.data);
            if (res.data.length > 0 && !activeConversationId) {
                setActiveConversationId(res.data[0].id);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load conversations");
        } finally {
            setLoadingConversations(false);
        }
    }

    async function fetchMessages(conversationId: string) {
        setLoadingMessages(true);
        try {
            const res = await axios.get(`/api/conversations/${conversationId}/messages`);
            setMessages(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load message history");
        } finally {
            setLoadingMessages(false);
        }
    }

    async function handleCreateConversation() {
        try {
            const res = await axios.post("/api/conversations", { title: `Chat ${conversations.length + 1}` });
            setConversations([res.data, ...conversations]);
            setActiveConversationId(res.data.id);
            toast.success("New chat started! ❤️");
        } catch (err) {
            console.error(err);
            toast.error("Failed to create conversation");
        }
    }

    async function handleDeleteConversation(id: string) {
        try {
            await axios.delete(`/api/conversations/${id}`);
            const updated = conversations.filter(c => c.id !== id);
            setConversations(updated);
            if (activeConversationId === id) {
                setActiveConversationId(updated.length > 0 ? updated[0].id : null);
            }
            toast.success("Chat deleted");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete chat");
        }
    }

    async function handleSendMessage(text: string) {
        if (!activeConversationId) return;

        // Optimistically add user message to list
        const userMsg = { role: "user", content: text, createdAt: new Date().toISOString() };
        setMessages(prev => [...prev, userMsg]);
        setAiLoading(true);

        try {
            const res = await axios.post("/api/chat", {
                conversationId: activeConversationId,
                message: text
            });

            // Add AI response message to list
            const assistantMsg = { role: "assistant", content: res.data.reply, createdAt: new Date().toISOString() };
            setMessages(prev => [...prev, assistantMsg]);

            // Update affection score in conversations list
            if (res.data.affectionScore !== undefined) {
                setConversations(prev => prev.map(c => 
                    c.id === activeConversationId 
                        ? { ...c, affectionScore: res.data.affectionScore } 
                        : c
                ));
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to send message");
        } finally {
            setAiLoading(false);
        }
    }

    async function handleChangePersonality(personality: string) {
        if (!activeConversationId) return;
        try {
            await axios.patch(`/api/conversations/${activeConversationId}`, { personality });
            setConversations(conversations.map(c => c.id === activeConversationId ? { ...c, personality } : c));
            toast.success(`Personality updated to ${personality}! ✨`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to change personality");
        }
    }

    const activeConversation = conversations.find(c => c.id === activeConversationId);

    return (
        <div className="flex h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden font-sans">
            <Sidebar
                conversations={conversations}
                activeId={activeConversationId}
                loading={loadingConversations}
                onSelect={setActiveConversationId}
                onCreate={handleCreateConversation}
                onDelete={handleDeleteConversation}
            />
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar />
                <ChatBox
                    conversation={activeConversation}
                    messages={messages}
                    loading={loadingMessages}
                    aiLoading={aiLoading}
                    onSend={handleSendMessage}
                    onChangePersonality={handleChangePersonality}
                />
            </div>
        </div>
    );
}
