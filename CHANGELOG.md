# @mastra/telegram

## Unreleased

Initial release — a Mastra `ChannelProvider` over Vercel's Chat SDK Telegram
adapter (`@chat-adapter/telegram`), to parity with `@mastra/slack`.

### Features

- **`TelegramProvider`** implementing `ChannelProvider` — `connect()` (immediate
  via a validated BotFather token, or a BotFather `deep_link`), `disconnect()`,
  `initialize()`, `configure()`, `getInfo()`, `listInstallations()`,
  `getInstallation()`, `isConfigured()`, `getAdapter()`.
- **Multi-token install store** — one bot per agent; tokens validated via `getMe`.
  Optional AES-256-GCM encryption at rest for `botToken`/`secretToken`.
- **Webhook lifecycle** — per-bot `setWebhook`/`deleteWebhook`, mutually exclusive
  with long-polling, and a mounted `POST /api/webhooks/telegram/:webhookId` route
  with constant-time `X-Telegram-Bot-Api-Secret-Token` verification.
- **Command registration** via `setMyCommands` (seeds `/start` `/help` `/settings`).
- **Streaming replies** — post-and-edit (`editMessageText`) with a `sendChatAction`
  typing keepalive; `toolDisplay` defaults to `'text'` (Telegram has no Block Kit).
- **`ChannelConfig` passthrough** — `handlers`, `inlineMedia`, `inlineLinks`,
  `state`, `threadContext`, `chatOptions`, `resolveResourceId`, `tools`,
  `cors`, `formatError`, `logger`, `waitUntil`/`resolveWaitUntil`, `onInstall`.

### Packaging

- **Dual ESM + CJS.** Mirrors `@mastra/slack`: the ESM-only `@chat-adapter/telegram`
  is kept external in the ESM build (lean, deduped) but bundled into the CJS output,
  so `require('@mastra/telegram')` works without touching the adapter's ESM-only entry.
