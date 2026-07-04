import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Navbar from "@/components/Navbar"

export default async function Profile() {
  const session: any = await auth()
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
          <h1 className="text-3xl font-bold mb-6 text-violet-600 dark:text-violet-400">Your Profile</h1>
          <div className="space-y-4">
            <div>
              <span className="font-semibold">Name:</span> {session.user?.name}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {session.user?.email}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
