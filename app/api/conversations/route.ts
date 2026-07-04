import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
    const session = await auth();
    if (!session || !session.user || !(session.user as any).id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversations = await prisma.conversation.findMany({
        where: {
            userId: (session.user as any).id
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return NextResponse.json(conversations);
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session || !session.user || !(session.user as any).id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { title, personality } = body;

    const conversation = await prisma.conversation.create({
        data: {
            title: title || "New Chat",
            personality: personality || "cute",
            userId: (session.user as any).id
        }
    });

    return NextResponse.json(conversation);
}
