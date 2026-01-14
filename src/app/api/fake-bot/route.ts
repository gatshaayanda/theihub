import { NextResponse } from "next/server";

type BotResponse = { reply: string; suggestions?: string[] };

// ─── Constants ──────────────────────────────────────────────────────────────
const CONTACT = {
  phone: "+267 71 680 243",
  email: "booking@scentsandsuites.com",
  address: "Village, Gaborone, Botswana",
};

const PATHS = {
  gallery: "/gallery",
  rooms: "/room-styles",
  contact: "/contact",
  brochure: "/scents-suites-brochure.pdf",
};

const SUGG = {
  ROOMS: "View suites",
  AMENITIES: "See amenities",
  BOOK: "Book a stay",
  CONTACT: "Contact us",
  BROCHURE: "Download brochure (PDF)",
  LOCATION: "Where are you located?",
  GALLERY: "View gallery",
} as const;

type Suggestion = (typeof SUGG)[keyof typeof SUGG];

// ─── Lightweight runtime memory ─────────────────────────────────────────────
let memory: {
  name?: string;
  greeted?: boolean;
  lastIntent?: string;
} = {};

// ─── Utilities ──────────────────────────────────────────────────────────────
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const reply = (text: string, suggestions?: Suggestion[]): BotResponse => ({
  reply: text.trim(),
  suggestions,
});

const normalize = (s: unknown): string =>
  (String(s ?? "") || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const includesAny = (s: string, pats: (string | RegExp)[]) =>
  pats.some((p) => (p instanceof RegExp ? p.test(s) : s.includes(p)));

// ─── Phrase pools ───────────────────────────────────────────────────────────
const tone = {
  greet: [
    "Welcome to Scents & Suites 🌿 It’s lovely to have you here.",
    "Good to see you again at Scents & Suites Luxury Villa.",
    "Hello and welcome — I’m your virtual concierge.",
  ],
  askName: [
    "May I know your first name, so I can assist you more personally?",
    "Before we continue, what should I call you?",
  ],
  mood: [
    "That’s wonderful to hear 💛",
    "I’m glad to hear that — a calm mood always fits this place.",
    "Ah, that sounds peaceful. You’ll feel right at home here.",
  ],
  suites: [
    "Each suite carries its own scent story — from soft amber to cedar calm. Would you like to see a preview?",
    "We have three elegant suite types, each designed for privacy and comfort. Would you like me to show them?",
  ],
  amenities: [
    "Our amenities include Wi-Fi, ensuite baths, A/C, breakfast, secure parking, and serene garden access.",
    "Every suite includes a private bath, breakfast service, and a tranquil courtyard to unwind.",
  ],
  brochure: [
    `Here’s our digital brochure:\n${PATHS.brochure}\nIt includes suites, rates, and amenities in detail.`,
    `Of course — here’s our brochure link:\n${PATHS.brochure}\nPerfect for browsing later.`,
  ],
  contact: [
    `You can reach our concierge team anytime:\n📞 ${CONTACT.phone}\n📧 ${CONTACT.email}\n📍 ${CONTACT.address}`,
    `Our reservations desk is always happy to help:\nPhone: ${CONTACT.phone}\nEmail: ${CONTACT.email}`,
  ],
  closing: [
    "Would you like to check current availability or see our suites?",
    "Shall I show you photos or send the brochure?",
    "Would you like to plan a visit or see our rooms first?",
  ],
};

// ─── Intents ────────────────────────────────────────────────────────────────
type Intent = {
  name: string;
  weight: number;
  matchers: (string | RegExp)[];
  respond: (text: string) => BotResponse;
};

const INTENTS: Intent[] = [
  {
    name: "greeting",
    weight: 3,
    matchers: [/\b(hello|hi|hey|greetings|good (morning|afternoon|evening))\b/, /\b(who|about|what is this)\b/],
    respond: () => {
      memory.greeted = true;
      const line1 = pick(tone.greet);
      const line2 = memory.name
        ? `Lovely to have you back, ${memory.name}.`
        : pick(tone.askName);
      return reply(`${line1}\n${line2}`, [SUGG.ROOMS, SUGG.BROCHURE]);
    },
  },

  {
    name: "introduce",
    weight: 3,
    matchers: [/\b(my name is|i am|i’m)\s+([a-z]+)/i],
    respond: (text) => {
      const match = text.match(/\b(my name is|i am|i’m)\s+([a-z]+)/i);
      const name = match?.[2]
        ? match[2].charAt(0).toUpperCase() + match[2].slice(1)
        : undefined;
      if (name) memory.name = name;
      return reply(
        `It’s a pleasure to meet you, ${name || "there"} 🌿 How can I make your day easier today?`,
        [SUGG.ROOMS, SUGG.BROCHURE, SUGG.BOOK]
      );
    },
  },

  {
    name: "smalltalk",
    weight: 2,
    matchers: [/\b(how are you|how's it going|fine|good|great|tired|okay)\b/],
    respond: () =>
      reply(`${pick(tone.mood)}\n${pick(tone.closing)}`, [SUGG.ROOMS, SUGG.BOOK]),
  },

  {
    name: "rooms",
    weight: 3,
    matchers: [/\b(room|suite|price|rate|stay|booking|book|availability)\b/],
    respond: () => {
      const intro =
        memory.lastIntent === "amenities"
          ? "Since you asked about amenities earlier, you might like this —"
          : "";
      return reply(`${intro}\n${pick(tone.suites)}\n${pick(tone.closing)}`, [
        SUGG.ROOMS,
        SUGG.BOOK,
        SUGG.BROCHURE,
      ]);
    },
  },

  {
    name: "amenities",
    weight: 2,
    matchers: [/\b(wifi|ac|air|amenities|breakfast|spa|services|pool|parking)\b/],
    respond: () =>
      reply(`${pick(tone.amenities)}\n${pick(tone.closing)}`, [
        SUGG.AMENITIES,
        SUGG.ROOMS,
        SUGG.BOOK,
      ]),
  },

  {
    name: "gallery",
    weight: 2,
    matchers: [/\b(photo|gallery|images|pictures|view|see)\b/],
    respond: () =>
      reply(
        "Absolutely — our photo gallery beautifully captures the villa’s calm and design details.",
        [SUGG.GALLERY, SUGG.ROOMS, SUGG.BROCHURE]
      ),
  },

  {
    name: "brochure",
    weight: 2,
    matchers: [/\b(pdf|brochure|download|catalog|details)\b/],
    respond: () => reply(pick(tone.brochure), [SUGG.ROOMS, SUGG.BOOK]),
  },

  {
    name: "contact",
    weight: 3,
    matchers: [/\b(contact|email|phone|call|reach|speak|message|whatsapp)\b/],
    respond: () =>
      reply(`${pick(tone.contact)}\n${pick(tone.closing)}`, [
        SUGG.CONTACT,
        SUGG.BOOK,
        SUGG.LOCATION,
      ]),
  },

  {
    name: "location",
    weight: 2,
    matchers: [/\b(where|address|location|map|gaborone|village)\b/],
    respond: () =>
      reply(
        "We’re quietly tucked in Village, Gaborone — peaceful, secure, and surrounded by charming cafés.",
        [SUGG.CONTACT, SUGG.BOOK, SUGG.ROOMS]
      ),
  },

  {
    name: "social",
    weight: 1,
    matchers: [/\b(thanks|thank you|appreciate|perfect|great|awesome)\b/],
    respond: () =>
      reply(
        pick([
          "You’re most welcome 💛 Always happy to assist.",
          "It’s been my pleasure — would you like to plan your visit next?",
          "Glad I could help 🌿",
        ]),
        [SUGG.ROOMS, SUGG.BOOK, SUGG.BROCHURE]
      ),
  },

  {
    name: "help",
    weight: 1,
    matchers: [/\b(help|assist|options|menu|confused)\b/],
    respond: () =>
      reply(
        "Of course — I can show you suites, amenities, or booking info. What would you like to explore first?",
        [SUGG.ROOMS, SUGG.AMENITIES, SUGG.CONTACT]
      ),
  },
];

// ─── Fallback ───────────────────────────────────────────────────────────────
const FALLBACK = () =>
  reply(
    pick([
      "Hmm, I didn’t quite catch that — could you say it another way?",
      "I might not know that yet, but I can help with suites, pricing, or contact info.",
      `You can always reach us directly:\n📞 ${CONTACT.phone} | ✉️ ${CONTACT.email}`,
    ]),
    [SUGG.ROOMS, SUGG.BROCHURE, SUGG.CONTACT]
  );

// ─── Intent Detection ───────────────────────────────────────────────────────
function detectIntent(text: string): Intent | null {
  const scores = INTENTS.map((intent) => {
    const hits = intent.matchers.reduce(
      (acc, m) => (includesAny(text, [m]) ? acc + 1 : acc),
      0
    );
    return { intent, score: hits * intent.weight };
  });
  scores.sort((a, b) => b.score - a.score);
  const top = scores[0];
  return top && top.score > 0 ? top.intent : null;
}

// ─── API Handler ────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  let text = "";
  try {
    const body = await req.json();
    text = normalize(body?.message);
  } catch {}

  if (!text) {
    const greet = pick(tone.greet);
    return NextResponse.json(
      reply(`${greet}\n${pick(tone.closing)}`, [SUGG.ROOMS, SUGG.BROCHURE, SUGG.BOOK])
    );
  }

  const intent = detectIntent(text);
  if (intent) {
    memory.lastIntent = intent.name;
    return NextResponse.json(intent.respond(text));
  }

  return NextResponse.json(FALLBACK());
}
