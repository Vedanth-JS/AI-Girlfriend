import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getAIResponse, PERSONALITIES } from "@/lib/groq";

export async function POST(req: Request) {
    const session = await auth();
    if (!session || !session.user || !(session.user as any).id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { conversationId, message } = body;

    if (!conversationId || !message) {
        return NextResponse.json({ error: "Missing conversationId or message" }, { status: 400 });
    }

    const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId }
    });

    if (!conversation) {
        return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    if (conversation.userId !== (session.user as any).id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 1. Save user's message
    await prisma.message.create({
        data: {
            conversationId,
            role: "user",
            content: message
        }
    });

    // 2. Fetch full message history for this conversation
    const history = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "asc" }
    });

    const messages = history.map(m => ({
        role: m.role,
        content: m.content
    }));

    // 3. Call Groq with selected personality
    const personality = (conversation.personality as keyof typeof PERSONALITIES) || "cute";
    const reply = await getAIResponse(messages, personality);

    // 4. Save AI's message
    await prisma.message.create({
        data: {
            conversationId,
            role: "assistant",
            content: reply
        }
    });

    // 5. Increment conversation affection score
    const updatedConversation = await prisma.conversation.update({
        where: { id: conversationId },
        data: {
            affectionScore: {
                increment: Math.floor(Math.random() * 3) + 1
            }
        }
    });

    return NextResponse.json({
        reply,
        affectionScore: updatedConversation.affectionScore
    });
}
