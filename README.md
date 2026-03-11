# Dev Utility Bot 🤖

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Discord.js](https://img.shields.io/badge/Discord.js_v14-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)

A feature-rich Discord bot providing developer utilities directly in your server — from regex testing and JSON formatting to live GitHub repository lookups, all backed by a persistent PostgreSQL database.

---

## Live Demo

**[→ Join the Test Server](https://discord.gg/Q8FXG5FKqG)** and try out all commands live.

---

## Features & Commands

| Command | Description |
|---|---|
| `/ping` | Returns the bot's current API latency in milliseconds. |
| `/base64 encode` | Encodes a plain text string to Base64. |
| `/base64 decode` | Decodes a Base64 string back to plain text. |
| `/json validate` | Checks whether a given string is valid JSON. |
| `/json format` | Pretty-prints a JSON string with syntax highlighting. |
| `/regex` | Tests a regular expression against an input string, with optional flags. Returns all matches found. |
| `/color` | Generates a visual color preview image for a given HEX color code. |
| `/github repo` | Fetches live stats for any public GitHub repository (stars, language, description, last update). |
| `/stats` | Displays the top 5 most-used commands. **Usage counts are persisted in the PostgreSQL database** via Prisma, surviving bot restarts. |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js |
| **Language** | TypeScript 5 |
| **Bot Framework** | Discord.js v14 |
| **Database** | PostgreSQL via [Neon](https://neon.tech) (serverless) |
| **ORM** | Prisma 7 |
| **Image Generation** | `@napi-rs/canvas` |
| **Schema Validation** | Zod |
| **Testing** | Vitest |
| **Hosting** | [Railway](https://railway.app) |

---

## Local Setup

### Prerequisites

- Node.js 18+
- A Discord bot token ([Discord Developer Portal](https://discord.com/developers/applications))
- A PostgreSQL database URL (e.g. a free [Neon](https://neon.tech) project)

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/niklasr-c/dev-utility-bot.git
cd dev-utility-bot
npm install
```

**2. Configure environment variables**

Create a `.env` file in the project root:
```env
DISCORD_TOKEN=your_discord_bot_token_here
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

**3. Set up the database**
```bash
npx prisma generate
npx prisma db push
```

**4. Start the development server**
```bash
npm run dev
```

---

## Project Structure

```
dev-utility-bot/
├── prisma/
│   └── schema.prisma        # Database schema (CommandStat model)
│
└── src/
    ├── bot.ts               # Entry point — client setup, event handlers, login
    ├── commands/
    │   ├── dev/             # Developer utility commands (ping, base64, json, regex, color, stats)
    │   └── github/          # GitHub integration commands (repo)
    ├── config/
    │   └── env.ts           # Zod-validated environment variables
    ├── database/
    │   └── prisma.ts        # Prisma client singleton
    ├── services/
    │   ├── colorService.ts  # Canvas-based color image generation
    │   └── githubService.ts # GitHub REST API integration
    └── utils/
        ├── base64.ts        # Encode/decode utilities
        ├── json.ts          # JSON validation & formatting
        └── regex.ts         # Regex testing logic
```

---

## Architecture Notes

- **Type-safe commands**: Every command implements a shared `Command` interface, ensuring consistent structure across the codebase.
- **Persistent statistics**: The `CommandStat` table in PostgreSQL is updated via Prisma `upsert` on every successful command execution — no in-memory counters that reset on restart.
- **Environment validation**: All environment variables are parsed and validated with Zod at startup, failing fast with a clear error rather than crashing later at runtime.
- **Modular design**: Commands are auto-discovered from the filesystem at startup and registered globally with the Discord API — adding a new command requires no changes to `bot.ts`.
