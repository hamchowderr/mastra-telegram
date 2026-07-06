/**
 * Minimal example: give a Mastra agent a Telegram bot.
 *
 * Prerequisites:
 *   1. Create a bot with @BotFather (`/newbot`) and copy its token.
 *   2. A public HTTPS URL for webhooks (a tunnel like `cloudflared` works in dev).
 *
 * Run (from a project that has @mastra/core, @mastra/telegram and a model provider):
 *   TELEGRAM_BOT_TOKEN=... MASTRA_SERVER_BASE_URL=https://your-tunnel.example.com \
 *     tsx example/telegram-agent.ts
 *
 * Then message your bot. `setWebhook`, secret-token verification, `setMyCommands`,
 * typing keepalive and reply streaming are all handled by the provider + adapter.
 */
import { Mastra } from '@mastra/core'
import { Agent } from '@mastra/core/agent'
import { anthropic } from '@ai-sdk/anthropic'
import { TelegramProvider } from '@mastra/telegram'

const supportAgent = new Agent({
  id: 'support',
  name: 'support',
  instructions: 'You are a concise, friendly support agent. Answer in plain language.',
  model: anthropic('claude-opus-4-8'),
})

// One provider serves every agent; each bot token maps to one agent.
const telegram = new TelegramProvider({
  // Omit to auto-detect from the Mastra server config.
  baseUrl: process.env.MASTRA_SERVER_BASE_URL,
  // Persist installations in production (Postgres/libSQL). Defaults to
  // Mastra's channels storage when available, else in-memory (dev only).
})

export const mastra = new Mastra({
  agents: { support: supportAgent },
  channels: { telegram },
})

// Connect the agent to a bot. In an app this is usually triggered from the
// editor UI or an admin route; here we do it inline for illustration.
async function main() {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) throw new Error('Set TELEGRAM_BOT_TOKEN to a BotFather token')

  const result = await telegram.connect('support', {
    botToken: token,
    // Defaults to /start /help /settings when omitted.
    commands: ['/start', '/help', { command: 'ask', description: 'Ask a question' }],
  })

  // Telegram has no OAuth, so a validated token connects immediately.
  console.log('connected:', result) // { type: 'immediate', installationId: '...' }
  console.log('installations:', await telegram.listInstallations())
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
