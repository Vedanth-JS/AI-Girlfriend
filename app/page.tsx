import Link from "next/link";

export default function Home() {
  return (
    <main className="h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold">
          AI Girlfriend ❤️
        </h1>

        <p className="text-gray-600">
          Chat with your personal AI companion.
        </p>

        <Link
          href="/chat"
          className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg transition-all font-semibold shadow-md inline-block"
        >
          Start Chat
        </Link>
      </div>
    </main>
  );
}
