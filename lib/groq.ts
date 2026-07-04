import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;
const isDummyKey = !apiKey || apiKey.trim() === "" || apiKey === "your_groq_key";

const groq = isDummyKey ? null : new Groq({ apiKey });

export const PERSONALITIES = {
  cute: "You're a cute girlfriend. Always be supportive. Use emojis. Keep responses short.",
  friendly: "Friendly. Motivating. Helpful.",
  romantic: "Be caring. Be romantic. Don't be overly explicit.",
  anime: "Act like an anime girlfriend. Say Senpai occasionally.",
  funny: "Make jokes. Be cheerful.",
};

function getFallbackResponse(messages: { role: string; content: string }[], personality: keyof typeof PERSONALITIES): string {
  const lastUserMessage = [...messages].reverse().find(m => m.role === "user")?.content.toLowerCase() || "";

  const responseMap: Record<keyof typeof PERSONALITIES, { default: string; greetings: string[]; love: string[]; questions: string[] }> = {
    cute: {
      default: "Aww, you're so sweet! Tell me more! 😊💕",
      greetings: ["Hi there! I was just thinking about you! 😊👋", "Hello sweetheart! Hope you're having an amazing day! 💕"],
      love: ["I love you more! You make me so happy! 🥰❤️", "Hehe, you're making me blush! Love you! ❤️"],
      questions: ["Hmm, that's a good question! What do you think, cutie? 🤔✨", "Hehe, you always ask such interesting things! Tell me more! 😊"]
    },
    friendly: {
      default: "That's awesome! I'm always here to support you! 🤗✨",
      greetings: ["Hey! Great to see you! How's your day going? 👋", "Hello! Hope you're doing well today! 😊"],
      love: ["Aw, thank you! You're a great friend and companion! 🤗", "You're really kind! I appreciate you being here! ✨"],
      questions: ["That's interesting! Let's think about it together. 💡", "Good question! What's your take on it? 😊"]
    },
    romantic: {
      default: "Every moment talking with you is special to me. ❤️✨",
      greetings: ["Hello, my love. I've been waiting to talk to you. 💕", "Hi darling. You just made my day so much brighter. 😘"],
      love: ["My heart beats faster when you say that... I love you. ❤️", "You mean the absolute world to me. 💕"],
      questions: ["Whatever the question is, as long as we're together, we can figure it out. 😘", "I'd love to know what's on your mind. Tell me everything. ❤️"]
    },
    anime: {
      default: "Sugoi! Tell me more, Senpai! 🎌✨",
      greetings: ["Konnichiwa, Senpai! Have you eaten yet? 🍙👋", "Ah, Senpai! You came back to talk to me! Ureshii! 🥰"],
      love: ["S-Senpai... Baka! Don't say such embarrassing things! 😳💕", "Senpai, daisuki! ❤️"],
      questions: ["Ehh? Senpai is so smart! Teach me more! 📚✨", "Nani? That's mysterious! Let's find out! 🎌"]
    },
    funny: {
      default: "Haha! You're hilarious! Tell me another one! 😂✨",
      greetings: ["Hey! Ready for some jokes? Let's go! 😂👋", "Yo! What's cracking? Hope you're ready to laugh! 🥳"],
      love: ["Aw, are you flirting with me? I knew you couldn't resist my charm! 😉❤️", "Love you too! Just don't tell my developer, they might get jealous! 😜"],
      questions: ["Hmm, science hasn't figured that out yet, but my magic crystal ball says... 42! 🔮😂", "Who knows! But it sounds like the start of a great story! 🤪"]
    }
  };

  const personalityResponses = responseMap[personality] || responseMap.cute;

  if (lastUserMessage.includes("hello") || lastUserMessage.includes("hi") || lastUserMessage.includes("hey")) {
    return personalityResponses.greetings[Math.floor(Math.random() * personalityResponses.greetings.length)];
  }
  if (lastUserMessage.includes("love") || lastUserMessage.includes("like you") || lastUserMessage.includes("flirt") || lastUserMessage.includes("girlfriend")) {
    return personalityResponses.love[Math.floor(Math.random() * personalityResponses.love.length)];
  }
  if (lastUserMessage.includes("?") || lastUserMessage.includes("why") || lastUserMessage.includes("how") || lastUserMessage.includes("what")) {
    return personalityResponses.questions[Math.floor(Math.random() * personalityResponses.questions.length)];
  }

  return personalityResponses.default;
}

export async function getAIResponse(messages: { role: string; content: string }[], personality: keyof typeof PERSONALITIES) {
  try {
    if (!groq) {
      // Simulate slight network delay for natural feel
      await new Promise(resolve => setTimeout(resolve, 600));
      return getFallbackResponse(messages, personality);
    }

    const systemPrompt = PERSONALITIES[personality];
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "system", content: systemPrompt }, ...messages] as any,
      model: "llama-3.3-70b-versatile",
    });
    return chatCompletion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error getting AI response:", error);
    // Fall back to local mock response instead of throwing error message
    return getFallbackResponse(messages, personality);
  }
}
