// For server-side auth checks (we'll use getServerSession)
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export async function auth() {
  return getServerSession(authOptions)
}
