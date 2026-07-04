# AI Girlfriend Chatbot

A modern, feature-rich AI chatbot with multiple personalities, built with Next.js, TypeScript, Prisma, and Groq/OpenAI.

## Features

- 💬 Real-time AI chat
- 👤 User authentication (email, Google, GitHub)
- ❤️ Multiple AI personalities (Cute, Friendly, Romantic, Anime, Funny)
- 📝 Chat history
- 🌙 Dark/Light mode
- 📱 Responsive UI
- 🔒 Secure API
- ⚡ Fast responses using Groq
- 💾 PostgreSQL database
- 🚀 Deployable on Vercel

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- NextAuth.js
- Groq SDK

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   Copy `.env.example` to `.env` and fill in your values:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/ai-girlfriend"
   NEXTAUTH_SECRET="your-secret-key-here"
   GROQ_API_KEY="your-groq-api-key"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GITHUB_ID="your-github-client-id"
   GITHUB_SECRET="your-github-client-secret"
   ```

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Usage

1. Register or sign in
2. Choose an AI personality
3. Start chatting!

## Project Structure

```
ai-girlfriend-chatbot/
├── app/                 # Next.js app router pages
├── components/          # React components
├── lib/                 # Utility functions (db, auth, groq)
├── pages/api/           # API routes (including auth)
├── prisma/              # Prisma schema
├── public/              # Static files
└── types/               # TypeScript types
```

## License

MIT
