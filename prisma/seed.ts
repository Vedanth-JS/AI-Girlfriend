import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash("12345678", 10);

    await prisma.user.create({
        data: {
            name: "Vedanth",
            email: "vedanth@gmail.com",
            password
        }
    });
}

main()
.catch(console.error)
.finally(() => prisma.$disconnect());
