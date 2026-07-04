import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
    const session = await auth();
    if (!session || !session.user || !(session.user as any).id) {
        return NextResponse.json(null);
    }

    const user = await prisma.user.findUnique({
        where: {
            id: (session.user as any).id
        }
    });

    return NextResponse.json(user);
}
